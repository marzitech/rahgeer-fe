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
 *
 * SSR note: every entry point is guarded with `typeof window` since these
 * are imported from components that render on the server.
 */

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
  const out: AttributionParams = {
    ...getStoredUtm(),
    ...utmParamsFrom(window.location.search),
  };

  const source = params.get("source");
  const sourceId = params.get("source_id");
  // "app" is the channel flag the mobile app uses (?source=app) — that is
  // LeadForm's `source` field, not promoter attribution.
  if (source && source !== "app") out.source = source.slice(0, MAX_VALUE_LENGTH);
  if (sourceId) out.source_id = sourceId.slice(0, MAX_VALUE_LENGTH);
  return out;
}
