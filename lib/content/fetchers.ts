import "server-only";

import { normalizeHomeContent, type HomeContent } from "./home-content";
import { normalizeTrips, type TripCard } from "./trips";

/**
 * Server-side reads of the editable travel content.
 *
 * These run during rendering, not in the browser, so they go straight to
 * the backend rather than through lib/api/client (which carries a user's
 * token and guest session — neither of which exists here).
 *
 * ── Why ISR and not a webhook ───────────────────────────────────────────
 * A publish in the dashboard appears within REVALIDATE_SECONDS. That is
 * fast enough for photo and copy edits, and it costs no webhook, no shared
 * secret and no failure mode where a missed ping leaves the site stale
 * forever. If instant publishing is wanted later, add a revalidate route
 * and keep this as the backstop.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/** How long a rendered page may serve content the desk has since changed. */
export const REVALIDATE_SECONDS = 60;

/**
 * Fetch and unwrap the backend's {data, status, status_code} envelope.
 *
 * Returns null on any failure — a timeout, a 500, malformed JSON. Callers
 * fall back to bundled content, so the site degrades to last-known-good
 * instead of to an error page.
 */
async function readApi(path: string): Promise<unknown | null> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`[content] ${path} responded ${response.status}`);
      return null;
    }
    const body = await response.json();
    return body && typeof body === "object" && "data" in body ? body.data : body;
  } catch (error) {
    console.error(`[content] ${path} failed`, error);
    return null;
  }
}

/** Hero carousel + "Why travel with us?" rows. Never throws. */
export async function getHomeContent(): Promise<HomeContent> {
  return normalizeHomeContent(await readApi("/api/v1/site-content/home/"));
}

/** Curated trips, in the order ops arranged them. Never throws. */
export async function getTrips(): Promise<TripCard[]> {
  return normalizeTrips(await readApi("/api/v1/packages/"));
}

/** One trip's full detail, or null when it is unpublished or unknown. */
export async function getTrip(slug: string): Promise<Record<string, unknown> | null> {
  const data = await readApi(`/api/v1/packages/${encodeURIComponent(slug)}/`);
  return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
}
