/**
 * The Photon proxy rewrites in next.config.ts inherit the /holidays
 * basePath automatically; a bare `/api/geocode/...` fetch from the browser
 * would instead land on marzi.life's own router and 404, silently killing
 * destination search in the planner.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { reverseGeocodeCity, searchDestinations } from "./geocode";

function stubFetch(body: unknown) {
  const spy = vi.fn(
    async () => new Response(JSON.stringify(body), { status: 200 }),
  );
  vi.stubGlobal("fetch", spy);
  return spy;
}

function calledUrl(spy: ReturnType<typeof vi.fn>): string {
  const [url] = spy.mock.calls[0] as unknown as [string];
  return url;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchDestinations", () => {
  it("calls the same-origin Photon proxy under the /holidays base path", async () => {
    const spy = stubFetch({ features: [] });
    await searchDestinations("Munnar");
    const url = new URL(calledUrl(spy), "http://localhost");
    expect(url.pathname).toBe("/holidays/api/geocode/search");
    expect(url.searchParams.get("q")).toBe("Munnar");
  });
});

describe("reverseGeocodeCity", () => {
  it("calls the same-origin reverse proxy under the /holidays base path", async () => {
    const spy = stubFetch({ features: [] });
    await reverseGeocodeCity(12.97, 77.59);
    const url = new URL(calledUrl(spy), "http://localhost");
    expect(url.pathname).toBe("/holidays/api/geocode/reverse");
    expect(url.searchParams.get("lat")).toBe("12.97");
  });
});
