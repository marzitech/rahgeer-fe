/**
 * Campaign / promoter attribution capture.
 *
 * Ported from marzi-web (`lib/promoterSource.ts`) with one generalisation:
 * instead of a fixed UTM key list, EVERY `utm_*` query param is captured —
 * so future links carrying utm_term, utm_content or custom keys like
 * utm_qr_batch flow through to the backend with zero code changes here.
 *
 * Semantics (same as marzi-web):
 * - utm_* params are persisted for 72h from first capture, so a lead
 *   submitted pages later (or on a return visit) still carries the
 *   acquisition campaign.
 * - A fresh set containing `utm_source` is a NEW campaign: it replaces the
 *   stored record and resets the clock. Other fresh params merge over.
 * - A plain visit (no utm in URL) never clobbers a stored campaign.
 * - Promoter `source` / `source_id` are read ONLY from the live URL at
 *   submit time — never persisted — so an organic visit can't inherit a
 *   promoter from an earlier referred session.
 * - Meta's `_fbc` (ad click) and `_fbp` (browser) are read from their own
 *   cookies at submit time. They are NOT persisted here: Meta sets both with
 *   a 90-day lifetime, so copying them into our 72h store would only make a
 *   staler duplicate. They are what lets the server tell Meta, hours later,
 *   which ad produced a lead the browser event may never have reported.
 *
 * SSR note: every entry point is guarded with `typeof window` since these
 * are imported from components that render on the server.
 */

import { readMetaCookies } from "@/lib/meta-pixel";

const TTL_MS = 72 * 60 * 60 * 1000; // 72 hours
const UTM_STORAGE_KEY = "rahgeer_utm";

// Mirror the backend firewall (EnquiryCreateSerializer) so a legit lead is
// truncated client-side rather than rejected with a 400.
const MAX_KEYS = 15;
const MAX_KEY_LENGTH = 64;
const MAX_VALUE_LENGTH = 200;

export type AttributionParams = Record<string, string>;

interface StoredUtm {
  params: AttributionParams;
  tc: number; // epoch ms — capture time
}

/** All utm_* params in the given query string, bounded and truncated. */
function utmParamsFrom(search: string): AttributionParams {
  const out: AttributionParams = {};
  for (const [key, value] of new URLSearchParams(search)) {
    if (!key.startsWith("utm_") || !value) continue;
    if (key.length > MAX_KEY_LENGTH) continue;
    if (Object.keys(out).length >= MAX_KEYS) break;
    out[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  return out;
}

/** Read persisted utm params (if present and within the 72h TTL). */
export function getStoredUtm(): AttributionParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredUtm;
    if (typeof parsed.tc !== "number" || Date.now() - parsed.tc > TTL_MS) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return {};
    }
    return parsed.params && typeof parsed.params === "object"
      ? parsed.params
      : {};
  } catch {
    return {};
  }
}

/**
 * Capture utm_* params from the current URL into storage. Call on every
 * page load / route change — a URL without utm params is a no-op.
 */
export function captureUtmFromUrl(): void {
  if (typeof window === "undefined") return;
  const fresh = utmParamsFrom(window.location.search);
  if (Object.keys(fresh).length === 0) return;

  // New utm_source = new campaign → replace outright (and reset the 72h
  // clock via the fresh tc). Otherwise merge over what's stored.
  const params = fresh.utm_source ? fresh : { ...getStoredUtm(), ...fresh };
  try {
    localStorage.setItem(
      UTM_STORAGE_KEY,
      JSON.stringify({ params, tc: Date.now() } satisfies StoredUtm),
    );
  } catch {
    /* storage unavailable — best-effort */
  }
}

/**
 * The attribution dict to send with a lead: persisted utm (survives
 * navigation) merged with the live URL — live wins, and also covers the
 * race where the form submits before the capture effect ran. Promoter
 * source/source_id ride along from the live URL only.
 */
export function getAttribution(): AttributionParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: AttributionParams = {
    ...getStoredUtm(),
    ...utmParamsFrom(window.location.search),
  };

  const identity: AttributionParams = {};
  const source = params.get("source");
  const sourceId = params.get("source_id");
  // "app" is the channel flag the mobile app uses (?source=app) — that is
  // LeadForm's `source` field, not promoter attribution.
  if (source && source !== "app") identity.source = source.slice(0, MAX_VALUE_LENGTH);
  if (sourceId) identity.source_id = sourceId.slice(0, MAX_VALUE_LENGTH);
  const { fbc, fbp } = readMetaCookies();
  if (fbc) identity.fbc = fbc.slice(0, MAX_VALUE_LENGTH);
  if (fbp) identity.fbp = fbp.slice(0, MAX_VALUE_LENGTH);

  return boundedAttribution(identity, utm);
}

/**
 * The backend caps the attribution dict at MAX_KEYS and rejects the whole
 * enquiry — a lost lead — when it is exceeded. So when there is more than
 * fits, decide WHAT to drop here rather than letting the server decide
 * whether to take the lead at all.
 *
 * Identity first (the click ids and the promoter, each of which is the only
 * copy of something), then the named UTMs in the order a report reads them,
 * then whatever custom keys a link invented. A fifteenth `utm_qr_batch` is
 * worth less than knowing which ad was clicked.
 */
const UTM_PRIORITY = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export function boundedAttribution(
  identity: AttributionParams,
  utm: AttributionParams,
): AttributionParams {
  const ordered = [
    ...Object.entries(identity),
    ...UTM_PRIORITY.filter((key) => key in utm).map(
      (key) => [key, utm[key]] as const,
    ),
    ...Object.entries(utm).filter(([key]) => !UTM_PRIORITY.includes(key)),
  ];
  const out: AttributionParams = {};
  for (const [key, value] of ordered) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    out[key] = value;
  }
  return out;
}
