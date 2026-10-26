/**
 * Meta (Facebook) Pixel for the travel site.
 *
 * ── Why this is a second copy and not an import ──────────────────────────────
 * marzi-web-next has a sibling module (`lib/meta-pixel.ts`) doing the same job
 * for marzi.life. There is no shared package between these two repos, and the
 * two sites differ in ways that are configuration, not logic: a different
 * hostname, no Google Tag Manager here (so no container to fight over
 * `window.fbq`), and no payment flow (travel pays on marzi.life/pay).
 *
 * What is NOT configuration, and must never drift, is further down: the
 * normalisation rules and the health-term filter. Both are copied verbatim.
 * Normalisation decides what gets hashed, so a phone normalised differently on
 * the two sites hashes to two different people and halves the match rate on a
 * customer who visited both. The health filter protects the dataset itself.
 * If a third surface ever needs this, these two files become a package.
 *
 * ── One dataset, two business lines ─────────────────────────────────────────
 * Travel deliberately reports to the SAME pixel as the community site
 * (owner decision, 2026-10-26). Every event from here therefore carries
 * `content_category: "travel"`, which is what Events Manager custom
 * conversions filter on to keep a ₹2L trip from training an optimiser
 * alongside a ₹500 meetup ticket. Dropping that property silently merges the
 * two funnels, so it is applied centrally in `travelParams()` rather than
 * trusted to each call site.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1508561727488746";

/** Tags every event from this site. See the header. */
const BUSINESS_LINE = "travel";

// ── Site gate ─────────────────────────────────────────────────────────────
// The pixel must only ever fire on the live travel site — not on localhost,
// and not on Vercel preview builds (which also run NODE_ENV=production).
// Every other helper in this file is a no-op wherever `window.fbq` does not
// exist, so this one gate is what keeps development traffic out of the
// dataset.
export const PIXEL_HOSTNAMES = new Set(["rahgeer.in", "www.rahgeer.in"]);

export function isPixelHostname(hostname: string): boolean {
  return PIXEL_HOSTNAMES.has(hostname);
}

type FbqParams = Record<string, unknown>;
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

function currentFbq(): Fbq | undefined {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fbq === "function" ? fbq : undefined;
}

// ── Health-content suppression (Meta compliance) ──────────────────────
// Meta restricts datasets that receive health-related signals, and this
// dataset is shared with the community site — so a single "wellness retreat"
// package title from here can cost that site its pixel. A travel product for
// people over 50 talks about yoga, wellness and mobility constantly, which
// makes this MORE load-bearing here than on marzi.life, not less.
//
// Copied verbatim from the sibling module; see the header.
const HEALTH_TERMS =
  /\b(anxiety|grief|arthritis|diabetes|therapy|medical|depression|dementia|wellness|health|yoga|exercise)\b/i;

/** Neutralizes content titles that Meta could read as health-related. */
function metaSafeContentName(name: string): string {
  return HEALTH_TERMS.test(name) ? "Marzi Travel" : name;
}

function sanitizeParams(params: FbqParams): FbqParams {
  const out = { ...params };
  if (typeof out.content_name === "string") {
    out.content_name = metaSafeContentName(out.content_name);
  }
  if (typeof out.search_string === "string" && HEALTH_TERMS.test(out.search_string)) {
    delete out.search_string;
  }
  return out;
}

// ── `_fbc` click-id cookie (Event Match Quality) ──────────────────────
// The pixel sets `_fbc` itself when it loads with `?fbclid=` in the URL, but
// the click id gets lost on redirects and client-side routing. So: stash the
// fbclid on landing and write the cookie ourselves whenever it is missing.
//
// This matters more here than on the community site, because a travel lead is
// matched back to its ad SERVER-side, from `_fbc` carried on the enquiry (see
// lib/attribution.ts). No cookie, no attribution — the browser Lead event is
// the only signal that survives, and ad blockers eat a third of those.

const FBCLID_STORAGE_KEY = "rahgeer_fbclid";

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * The pixel's own identifiers as they stand right now: `_fbc` (the click, with
 * Meta's timestamp) and `_fbp` (the browser). Sent with an enquiry so the
 * server holds Meta's exact values rather than re-deriving them — a re-derived
 * `_fbc` carries OUR timestamp, which Meta reads as a different click.
 * Empty on the server and wherever the cookies are unset.
 */
export function readMetaCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === "undefined") return {};
  try {
    const fbc = readCookie("_fbc");
    const fbp = readCookie("_fbp");
    return { ...(fbc && { fbc }), ...(fbp && { fbp }) };
  } catch {
    return {};
  }
}

export function captureFbclid(): void {
  if (typeof window === "undefined") return;
  let fbclid: string | null = null;
  try {
    fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) window.sessionStorage.setItem(FBCLID_STORAGE_KEY, fbclid);
    else fbclid = window.sessionStorage.getItem(FBCLID_STORAGE_KEY);
  } catch {
    // Storage unavailable — fall through with whatever the URL gave us.
  }
  if (!fbclid) return;

  // Never modify the fbclid itself (case-sensitive, sent verbatim).
  const existing = readCookie("_fbc");
  if (existing?.endsWith(`.${fbclid}`)) return;

  const value = `fb.1.${Date.now()}.${fbclid}`;
  // Scope to .rahgeer.in in production so www and the apex share it;
  // host-only elsewhere, where the pixel is off anyway.
  const host = window.location.hostname;
  const domain =
    host === "rahgeer.in" || host.endsWith(".rahgeer.in") ? "; domain=.rahgeer.in" : "";
  document.cookie = `_fbc=${value}; path=/; max-age=${90 * 24 * 60 * 60}${domain}; SameSite=Lax`;
}

// ── Advanced Matching (customer details) ──────────────────────────────
// Normalized per Meta's rules, then handed to `fbq('init', …)`, which hashes
// (SHA-256) everything before sending. Raw values never leave the module
// un-normalized, and nothing here is ever logged.
//
// Copied verbatim from the sibling module; see the header.

export interface MetaUserData {
  email?: string | null;
  /** Any format; normalized to digits with the 91 country code. */
  phone?: string;
  fullName?: string;
  city?: string;
}

export function normPhone(value?: string): string | undefined {
  let digits = (value ?? "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits || undefined;
}

export function normEmail(value?: string | null): string | undefined {
  const email = value?.trim().toLowerCase();
  return email && email.includes("@") ? email : undefined;
}

export function normName(value?: string): string | undefined {
  return (
    value
      ?.trim()
      .toLowerCase()
      // \p{M} — combining marks — alongside \p{L}. Without it every
      // Devanagari vowel sign is stripped, because a matra is a MARK and not
      // a letter: "रवि कुमार" becomes "रव कमर", which hashes to a person who
      // does not exist. The sibling module in marzi-web-next has the same
      // defect and is fixed in the same round.
      .replace(/[^\p{L}\p{M}\s]/gu, "")
      .replace(/\s+/g, " ") || undefined
  );
}

export function normCity(value?: string): string | undefined {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "") || undefined
  );
}

// The matching data accumulated so far. Module-level so details learned before
// the pixel initializes (or on an earlier page) are never lost.
let matchData: FbqParams = {};
let pixelInited = false;

/** Test seam: forget the pixel/matching state between cases. */
export function __resetMetaPixelForTests(): void {
  matchData = {};
  pixelInited = false;
}

/**
 * Feed customer details into Meta Advanced Matching. Merges with whatever is
 * already known and (re-)inits the pixel so the next event carries the data.
 * Safe to call anywhere, any time, with partial data.
 */
export function setMetaAdvancedMatching(user: MetaUserData): void {
  const [fn, ...rest] = normName(user.fullName)?.split(" ") ?? [];
  const next: FbqParams = {
    ...matchData,
    ...(normEmail(user.email) && { em: normEmail(user.email) }),
    ...(normPhone(user.phone) && { ph: normPhone(user.phone) }),
    ...(fn && { fn }),
    ...(rest.length > 0 && { ln: rest.join(" ") }),
    ...(normCity(user.city) && { ct: normCity(user.city) }),
    country: "in",
  };
  const changed = Object.keys(next).some((key) => next[key] !== matchData[key]);
  matchData = next;

  // Meta explicitly recommends re-initializing when details arrive after the
  // pixel loaded, so subsequent events match better.
  const fbq = currentFbq();
  if (changed && pixelInited && fbq) fbq("init", META_PIXEL_ID, matchData);
}

// ── Loader / init / events ────────────────────────────────────────────

const FBEVENTS_SRC = "https://connect.facebook.net/en_US/fbevents.js";

/**
 * Installs the fbq stub + fbevents.js and runs `fbq('init')` with the current
 * Advanced Matching data. Idempotent. Only components/MetaPixel.tsx calls it,
 * and only on the hostnames above.
 */
export function ensureMetaPixel(): void {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  if (!w.fbq) {
    const stub = ((...args: unknown[]) => {
      if (stub.callMethod) stub.callMethod(...args);
      else stub.queue.push(args);
    }) as Fbq;
    stub.queue = [];
    stub.push = stub;
    stub.loaded = true;
    stub.version = "2.0";
    w.fbq = stub;
    if (!w._fbq) w._fbq = stub;
  }
  if (!document.querySelector(`script[src="${FBEVENTS_SRC}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = FBEVENTS_SRC;
    document.head.appendChild(script);
  }
  if (!pixelInited) {
    // Disable Meta's automatic button-click / microdata events so Events
    // Manager only records what this module fires explicitly. Advanced
    // Matching is set deliberately above, so autoConfig loses nothing.
    w.fbq?.("set", "autoConfig", false, META_PIXEL_ID);
    w.fbq?.("init", META_PIXEL_ID, matchData);
    pixelInited = true;
  }
}

// ── Funnel events ─────────────────────────────────────────────────────
// Each helper enforces one trigger rule and throttles to once per subject per
// browser session, so Events Manager counts stay exact — somebody re-opening
// the same package page does not inflate ViewContent.

const ONCE_STORAGE_KEY = "rahgeer_meta_once";

/** True the first time this (event, subject) pair fires this session. */
export function firstThisSession(event: string, subject: string | number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.sessionStorage.getItem(ONCE_STORAGE_KEY);
    const seen: Record<string, 1> = raw ? JSON.parse(raw) : {};
    const key = `${event}:${subject}`;
    if (seen[key]) return false;
    seen[key] = 1;
    window.sessionStorage.setItem(ONCE_STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // Storage unavailable — fire unthrottled rather than not at all.
  }
  return true;
}

/** Fresh id for browser/server dedup on events the CAPI also mirrors. */
function newEventId(): string | undefined {
  return globalThis.crypto?.randomUUID?.();
}

export interface TravelItem {
  /** Package slug, destination slug or itinerary id — whatever the page is about. */
  id: string;
  title?: string | null;
  /** Rupees, not paise: Meta's `value` is a major-unit decimal. */
  priceInr?: number | null;
  /** "package" | "destination" | "itinerary" — reported as content_type. */
  kind?: string;
}

/**
 * The properties every travel event carries. `content_category` is the one
 * that keeps this business line separable inside a shared dataset, so it is
 * applied here and not at the call sites.
 */
function travelParams(item?: TravelItem): FbqParams {
  return {
    content_category: BUSINESS_LINE,
    ...(item && {
      content_ids: [item.id],
      content_type: item.kind ?? "product",
      ...(item.title && { content_name: item.title }),
      ...(item.priceInr != null && { value: item.priceInr, currency: "INR" }),
    }),
  };
}

export const metaFunnel = {
  /** A package / destination / itinerary page was opened. Once per item per session. */
  viewContent(item: TravelItem): void {
    if (typeof window === "undefined") return;
    if (!firstThisSession("ViewContent", `${item.kind ?? "product"}:${item.id}`)) return;
    trackMetaPixel("ViewContent", travelParams(item), { eventId: newEventId() });
  },

  /**
   * A phone number reached us — an enquiry the backend ACCEPTED. Once per
   * source per session.
   *
   * `eventId` is the caller's, not ours, because GANGADHAR mirrors this same
   * lead through the Conversions API and Meta deduplicates on
   * (event_name, event_id). A fresh uuid here would double-count every lead.
   */
  lead(opts: { source: string; eventId?: string; item?: TravelItem }): void {
    if (typeof window === "undefined") return;
    if (!firstThisSession("Lead", `${opts.source}:${opts.item?.id ?? ""}`)) return;
    trackMetaPixel(
      "Lead",
      { lead_source: opts.source, ...travelParams(opts.item) },
      { eventId: opts.eventId ?? newEventId() },
    );
  },

  /**
   * The customer opened a direct channel to us — WhatsApp or a phone call.
   * Once per channel per session. Standard `Contact`, so it is usable as a
   * campaign objective without configuring a custom conversion.
   */
  contact(opts: { channel: "whatsapp" | "call"; placement?: string }): void {
    if (typeof window === "undefined") return;
    if (!firstThisSession("Contact", `${opts.channel}:${opts.placement ?? ""}`)) return;
    trackMetaPixel(
      "Contact",
      {
        ...travelParams(),
        contact_channel: opts.channel,
        ...(opts.placement && { placement: opts.placement }),
      },
      { eventId: newEventId() },
    );
  },
};

/**
 * Fire a Meta Pixel standard event. No-op on the server, before the pixel has
 * loaded, or with a blank event name (a blank name shows up in Events Manager
 * as `__missing_event`) — so it is always safe to call.
 */
export function trackMetaPixel(
  event: string,
  params?: FbqParams,
  opts?: { eventId?: string },
): void {
  const fbq = currentFbq();
  if (!fbq || !event?.trim()) return;
  const clean = params ? sanitizeParams(params) : undefined;
  if (opts?.eventId) fbq("track", event, clean ?? {}, { eventID: opts.eventId });
  else fbq("track", event, clean);
}
