/**
 * core.ts — Environment-agnostic tracker core. No dependencies, no DOM
 * assumptions: storage and transport are injected, so the same core drives
 * the browser adapter today and a React Native (AsyncStorage) adapter later.
 *
 * Guarantees to the host app:
 *   * No public method ever throws — analytics can never break the product.
 *   * Fire-and-forget: nothing awaits on the render path.
 *   * Every event carries a UUID minted at creation, so server-side dedup
 *     makes retries and double-flushes exactly-once.
 *   * The queue persists to storage; unsent events survive reloads.
 */

export interface TrackerStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

/** Returns true when the batch was handed to the network layer successfully. */
export type TrackerTransport = (
  url: string,
  body: string,
  opts: { urgent: boolean }
) => Promise<boolean>;

export interface TrackerOptions {
  endpoint: string; // e.g. https://track.marzitech.in
  writeKey: string;
  storage: TrackerStorage;
  transport: TrackerTransport;
  getToken?: () => string | null;
  now?: () => number;
  uuid?: () => string;
  flushIntervalMs?: number;
  maxQueue?: number; // persisted-queue cap; oldest dropped beyond this
  maxBatch?: number; // events per request (server caps at 50)
  onError?: (msg: string) => void;
}

interface QueuedEvent {
  eventId: string;
  name: string;
  anonymousId: string;
  sessionId: string;
  page?: string;
  url?: string;
  referrer?: string;
  utm?: Record<string, string>;
  props?: Record<string, unknown>;
  ts: string;
  traits?: Record<string, unknown>;
}

const QUEUE_KEY = "gangadhar_queue";
const ANON_KEY = "gangadhar_anonymous_id";
const SESSION_KEY = "gangadhar_session";
const SESSION_IDLE_MS = 30 * 60 * 1000;

function fallbackUuid(now: () => number): string {
  // RFC4122-ish v4 without crypto — adapters should inject crypto.randomUUID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = ((now() + Math.random() * 16) % 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export class TrackerCore {
  private queue: QueuedEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private flushing = false;
  private readonly opts: Required<
    Pick<TrackerOptions, "flushIntervalMs" | "maxQueue" | "maxBatch">
  > &
    TrackerOptions;

  constructor(options: TrackerOptions) {
    this.opts = { flushIntervalMs: 4000, maxQueue: 200, maxBatch: 25, ...options };
    try {
      const saved = this.opts.storage.get(QUEUE_KEY);
      if (saved) this.queue = JSON.parse(saved) as QueuedEvent[];
    } catch {
      this.queue = [];
    }
    this.flushTimer = setInterval(() => void this.flush(), this.opts.flushIntervalMs);
    // Node-style timers keep the process alive; browsers ignore unref.
    (this.flushTimer as { unref?: () => void }).unref?.();
  }

  private now(): number {
    return this.opts.now ? this.opts.now() : Date.now();
  }

  private uuid(): string {
    try {
      return this.opts.uuid ? this.opts.uuid() : fallbackUuid(() => this.now());
    } catch {
      return fallbackUuid(() => this.now());
    }
  }

  get anonymousId(): string {
    try {
      let id = this.opts.storage.get(ANON_KEY);
      if (!id) {
        id = this.uuid();
        this.opts.storage.set(ANON_KEY, id);
      }
      return id;
    } catch {
      return "unknown";
    }
  }

  private sessionId(): string {
    try {
      const raw = this.opts.storage.get(SESSION_KEY);
      const t = this.now();
      if (raw) {
        const s = JSON.parse(raw) as { id: string; last: number };
        if (t - s.last < SESSION_IDLE_MS) {
          this.opts.storage.set(SESSION_KEY, JSON.stringify({ id: s.id, last: t }));
          return s.id;
        }
      }
      const id = this.uuid();
      this.opts.storage.set(SESSION_KEY, JSON.stringify({ id, last: t }));
      return id;
    } catch {
      return "unknown";
    }
  }

  /** Queue an event. Never throws. */
  track(
    name: string,
    fields: Partial<Omit<QueuedEvent, "eventId" | "name" | "anonymousId" | "sessionId" | "ts">> = {}
  ): void {
    try {
      if (!name) return;
      this.queue.push({
        eventId: this.uuid(),
        name,
        anonymousId: this.anonymousId,
        sessionId: this.sessionId(),
        ts: new Date(this.now()).toISOString(),
        ...fields,
      });
      if (this.queue.length > this.opts.maxQueue) {
        this.queue.splice(0, this.queue.length - this.opts.maxQueue);
      }
      this.persist();
      if (this.queue.length >= this.opts.maxBatch) void this.flush();
    } catch (err) {
      this.opts.onError?.(String(err));
    }
  }

  /** Send user traits to /v1/identify (requires a valid token to take effect). */
  identify(traits: Record<string, unknown>, fields: { page?: string; url?: string } = {}): void {
    try {
      const body = JSON.stringify(
        this.envelope([
          {
            eventId: this.uuid(),
            name: "$identify",
            anonymousId: this.anonymousId,
            sessionId: this.sessionId(),
            ts: new Date(this.now()).toISOString(),
            traits,
            ...fields,
          },
        ])
      );
      void this.opts
        .transport(`${this.opts.endpoint}/v1/identify`, body, { urgent: false })
        .catch(() => {});
    } catch (err) {
      this.opts.onError?.(String(err));
    }
  }

  private envelope(events: QueuedEvent[]): Record<string, unknown> {
    let token: string | null = null;
    try {
      token = this.opts.getToken?.() ?? null;
    } catch {
      token = null;
    }
    return {
      writeKey: this.opts.writeKey,
      ...(token ? { token } : {}),
      sentAt: new Date(this.now()).toISOString(),
      events,
    };
  }

  private persist(): void {
    try {
      this.opts.storage.set(QUEUE_KEY, JSON.stringify(this.queue));
    } catch {
      // storage full/unavailable: queue lives in memory only
    }
  }

  /** Send queued events. Events are only removed from the queue after the
   *  transport confirms hand-off; server-side event_id dedup makes any
   *  overlap harmless. */
  async flush(urgent = false): Promise<void> {
    if (this.flushing || this.queue.length === 0) return;
    this.flushing = true;
    try {
      const batch = this.queue.slice(0, this.opts.maxBatch);
      const body = JSON.stringify(this.envelope(batch));
      const delivered = await this.opts.transport(`${this.opts.endpoint}/v1/events`, body, {
        urgent,
      });
      if (delivered) {
        this.queue = this.queue.slice(batch.length);
        this.persist();
        // Drain remainder on the next tick(s).
        if (this.queue.length > 0 && !urgent) setTimeout(() => void this.flush(), 0);
      }
    } catch (err) {
      this.opts.onError?.(String(err)); // keep queue intact; retried next interval
    } finally {
      this.flushing = false;
    }
  }

  /** Best-effort synchronous-ish flush for page unload paths. */
  flushUrgent(): void {
    void this.flush(true);
  }

  destroy(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
  }
}
