/**
 * SSE helper for live itinerary-generation progress.
 *
 * Backend contract (rahgeer-be apps/ai/workflows/itinerary.py):
 *   status -> started -> retrieved -> facts -> outlining
 *     -> route_progress* (title, then each day's title, as they are written)
 *     -> outline (the route: days + highlights, hotels)
 *     -> day_ready* + dossier_ready (in whatever order they finish)
 *     -> finalising -> completed | failed
 * plus day_regenerating / day_completed / day_failed during day regens.
 * On connect the server replays the run's events so far, so a refresh or a
 * reconnect rebuilds the same screen (lib/api/progress.ts is idempotent).
 * Heartbeats are SSE comments (ignored by EventSource automatically).
 */

import { BASE_URL } from "./client";

export type ProgressEvent = {
  event:
    | "status"
    | "started"
    | "retrieved"
    | "facts"
    | "generating"
    | "outlining"
    | "route_progress"
    | "outline"
    | "day_ready"
    | "dossier_ready"
    | "finalising"
    | "completed"
    | "failed"
    | "day_regenerating"
    | "day_completed"
    | "day_failed";
  step?: string; // user-facing label ("Crafting your itinerary")
  [key: string]: unknown;
};

const TERMINAL = new Set(["completed", "failed"]);

/**
 * Subscribe to generation progress. Returns an unsubscribe function.
 * Closes itself on terminal events; EventSource auto-reconnects on drops
 * (the server replays current state on connect, so reconnects are safe).
 */
export function streamItineraryProgress(
  itineraryId: string,
  onEvent: (event: ProgressEvent) => void,
): () => void {
  const source = new EventSource(
    `${BASE_URL}/api/v1/itineraries/${itineraryId}/stream/`,
  );

  source.onmessage = (message) => {
    const payload = JSON.parse(message.data) as ProgressEvent;
    onEvent(payload);
    if (TERMINAL.has(payload.event)) source.close();
  };
  source.onerror = () => {
    // EventSource retries automatically; nothing to do. A terminal event
    // (possibly via the server's DB fallback) will close us cleanly.
  };

  return () => source.close();
}
