/**
 * app/sitemap.ts is the only thing that tells Google the travel pages now
 * live at marzi.life/holidays/... — every <loc> must be absolute and
 * carry the prefix, and a slug that is both in the backend and in the
 * bundled fallback content must appear once.
 */
import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemap-entries";

const input = {
  tripSlugs: ["ladakh", "vietnam"],
  packageSlugs: ["vietnam", "kerala"],
  destinationSlugs: ["goa"],
};

describe("sitemapEntries", () => {
  it("lists the static pages at their public /holidays URLs", () => {
    const urls = sitemapEntries(input).map((e) => e.url);
    expect(urls).toContain("https://marzi.life/holidays");
    expect(urls).toContain("https://marzi.life/holidays/enquiry");
    expect(urls).toContain("https://marzi.life/holidays/plan/yourself");
    expect(urls).toContain("https://marzi.life/holidays/plan/parents");
    expect(urls).toContain("https://marzi.life/holidays/plan/ai");
  });

  it("lists every package slug once, backend and bundled combined", () => {
    const urls = sitemapEntries(input).map((e) => e.url);
    const packages = urls.filter((u) => u.includes("/packages/"));
    expect(packages).toEqual([
      "https://marzi.life/holidays/packages/ladakh",
      "https://marzi.life/holidays/packages/vietnam",
      "https://marzi.life/holidays/packages/kerala",
    ]);
  });

  it("lists destination pages", () => {
    const urls = sitemapEntries(input).map((e) => e.url);
    expect(urls).toContain("https://marzi.life/holidays/destinations/goa");
  });

  it("never emits a relative or un-prefixed URL", () => {
    for (const { url } of sitemapEntries(input)) {
      expect(url.startsWith("https://marzi.life/holidays")).toBe(true);
    }
  });
});
