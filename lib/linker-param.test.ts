/**
 * marzi.life's GA4 tag has a cross-domain rule for "marzi.life", so every
 * link to this subdomain arrives as /?_gl=1*...*_ga*...  This site runs no
 * Google tag, so nothing consumes the parameter; it only makes shared URLs
 * ugly. It is removed from the address bar on load, leaving everything else
 * (utm_*, source, gclid) exactly as it came.
 */
import { describe, expect, it } from "vitest";

import { searchWithoutLinkerParam } from "./linker-param";

describe("searchWithoutLinkerParam", () => {
  it("returns null when there is nothing to strip", () => {
    expect(searchWithoutLinkerParam("")).toBeNull();
    expect(searchWithoutLinkerParam("?utm_source=wa")).toBeNull();
  });

  it("drops a lone _gl, leaving an empty search", () => {
    expect(
      searchWithoutLinkerParam("?_gl=1*ffzitx*_ga*ODM2.*_ga_6HLYP9SC8Z*czE3"),
    ).toBe("");
  });

  it("keeps every other parameter in order", () => {
    expect(
      searchWithoutLinkerParam(
        "?utm_source=google&_gl=1*abc*_ga*123&gclid=Cj0&source=app",
      ),
    ).toBe("?utm_source=google&gclid=Cj0&source=app");
  });

  it("does not touch parameters that merely start with _gl", () => {
    expect(searchWithoutLinkerParam("?_glx=1")).toBeNull();
  });
});
