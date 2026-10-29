/**
 * marzi.life's GA4 tag (property G-6HLYP9SC8Z) has a cross-domain rule for
 * "marzi.life", so every link into this subdomain is decorated with
 * `?_gl=1*...` carrying the visitor's GA and Google Ads ids. The rule only
 * helps if the destination runs a Google tag that reads it back — this site
 * does not, so the parameter is dead weight that makes shared URLs ugly.
 * It is removed from the address bar once the page is up; everything else
 * in the query (utm_*, gclid, source) is left exactly as it arrived.
 */
const LINKER_PARAM = "_gl";

/** The search string without `_gl`, or null when there was none to remove. */
export function searchWithoutLinkerParam(search: string): string | null {
  const params = new URLSearchParams(search);
  if (!params.has(LINKER_PARAM)) return null;
  params.delete(LINKER_PARAM);
  const rest = params.toString();
  return rest ? `?${rest}` : "";
}

/** Rewrite the current URL in place (no navigation, no history entry). */
export function stripLinkerParamFromUrl(): void {
  if (typeof window === "undefined") return;
  const cleaned = searchWithoutLinkerParam(window.location.search);
  if (cleaned === null) return;
  try {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${cleaned}${window.location.hash}`,
    );
  } catch {
    /* best-effort cosmetic cleanup */
  }
}
