/**
 * Analytics entry point — GANGADHAR (Marzi's in-house tracker) via the
 * vendored SDK in ./gangadhar-sdk. Same config convention as marzi-web:
 * endpoint/writeKey come from NEXT_PUBLIC_TRACKING_URL /
 * NEXT_PUBLIC_TRACKING_WRITE_KEY, with the shared web defaults.
 *
 * The SDK handles identity (persistent anonymousId, 30-min sessions),
 * batching, localStorage queue persistence, and sendBeacon flush on
 * pagehide — callers just track().
 */

import { gangadhar } from "./gangadhar-sdk/browser";

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  gangadhar.init({
    endpoint: process.env.NEXT_PUBLIC_TRACKING_URL || "https://track.marzitech.in",
    writeKey:
      process.env.NEXT_PUBLIC_TRACKING_WRITE_KEY ||
      "wk_web_742284be62e5de7f0450a1b1",
  });
  initialized = true;
}

/** Queue an event. Safe to call anywhere — no-ops on the server and never throws. */
export function track(name: string, props?: Record<string, unknown>): void {
  initAnalytics();
  gangadhar.track(name, props);
}

/** Record a pageview ($pageview). */
export function trackPageview(path?: string): void {
  initAnalytics();
  gangadhar.page(path);
}
