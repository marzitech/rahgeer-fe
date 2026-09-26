/**
 * browser.ts — Browser adapter: localStorage persistence, fetch transport
 * with sendBeacon for unload-time flushes, automatic UTM capture, and
 * pagehide/visibilitychange hooks. SSR-safe: constructing on the server
 * yields a no-op tracker.
 */

import { TrackerCore, type TrackerStorage } from "./core";

export interface BrowserTrackerOptions {
  endpoint: string;
  writeKey: string;
  getToken?: () => string | null;
  onError?: (msg: string) => void;
}

const memoryStore = (): TrackerStorage => {
  const m = new Map<string, string>();
  return { get: (k) => m.get(k) ?? null, set: (k, v) => void m.set(k, v) };
};

function localStorageStore(): TrackerStorage {
  try {
    const probe = "__gangadhar_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return {
      get: (k) => window.localStorage.getItem(k),
      set: (k, v) => window.localStorage.setItem(k, v),
    };
  } catch {
    return memoryStore(); // private mode / storage disabled
  }
}

function captureUtm(): Record<string, string> | undefined {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = params.get(key);
      if (v) utm[key.replace("utm_", "")] = v;
    }
    return Object.keys(utm).length ? utm : undefined;
  } catch {
    return undefined;
  }
}

export class BrowserTracker {
  private core: TrackerCore | null = null;
  private utm: Record<string, string> | undefined;

  init(opts: BrowserTrackerOptions): void {
    if (typeof window === "undefined" || this.core) return; // SSR or double-init
    try {
      this.utm = captureUtm();
      this.core = new TrackerCore({
        endpoint: opts.endpoint.replace(/\/$/, ""),
        writeKey: opts.writeKey,
        getToken: opts.getToken,
        onError: opts.onError,
        storage: localStorageStore(),
        uuid: () => crypto.randomUUID(),
        transport: async (url, body, { urgent }) => {
          if (urgent && navigator.sendBeacon) {
            // sendBeacon can't set headers → server accepts text/plain envelopes.
            return navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
          }
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: urgent,
          });
          // Client errors won't succeed on retry; treat as delivered to avoid poison-pill loops.
          return res.ok || (res.status >= 400 && res.status < 500);
        },
      });

      // Flush what we can when the page is going away.
      window.addEventListener("pagehide", () => this.core?.flushUrgent());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.core?.flushUrgent();
      });
    } catch (err) {
      opts.onError?.(String(err));
    }
  }

  track(name: string, props?: Record<string, unknown>): void {
    this.core?.track(name, {
      page: safePath(),
      url: safeHref(),
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      utm: this.utm,
      props,
    });
  }

  page(pathOverride?: string, props?: Record<string, unknown>): void {
    this.core?.track("$pageview", {
      page: pathOverride ?? safePath(),
      url: safeHref(),
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      utm: this.utm,
      props,
    });
  }

  identify(traits: Record<string, unknown>): void {
    // JWT-verified path: full snapshot upsert + anon-history merge.
    this.core?.identify(traits, { page: safePath(), url: safeHref() });
    // Anonymous path: /v1/identify is JWT-gated, so also ride the traits on a
    // tracked event — the server surfaces fullName/phone in live presence.
    this.core?.track("$identify", { page: safePath(), url: safeHref(), traits });
  }

  flush(): void {
    void this.core?.flush();
  }
}

function safePath(): string | undefined {
  try {
    return window.location.pathname;
  } catch {
    return undefined;
  }
}

function safeHref(): string | undefined {
  try {
    return window.location.href;
  } catch {
    return undefined;
  }
}

/** Shared singleton for app-wide use. */
export const gangadhar = new BrowserTracker();
