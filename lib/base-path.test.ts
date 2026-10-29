/**
 * The site is served as a zone of marzi.life under /holidays (Next
 * `basePath`). next/link, next/image and the router add the prefix on
 * their own; raw strings (CSS url(), fetch, the PWA manifest, canonicals)
 * do not, and they go through these helpers.
 */
import { describe, expect, it } from "vitest";

import { BASE_PATH, canonicalUrl, imageSrc, withBasePath } from "./base-path";

describe("BASE_PATH", () => {
  it("is the /holidays mount point", () => {
    expect(BASE_PATH).toBe("/holidays");
  });
});

describe("withBasePath", () => {
  it("prefixes a root-relative path", () => {
    expect(withBasePath("/images/textures/doodle-pattern.webp")).toBe(
      "/holidays/images/textures/doodle-pattern.webp",
    );
  });

  it("adds the leading slash when the path lacks one", () => {
    expect(withBasePath("icon-192.png")).toBe("/holidays/icon-192.png");
  });

  it("maps the site root to the mount point with a trailing slash", () => {
    expect(withBasePath("/")).toBe("/holidays/");
  });

  it("does not double-prefix an already prefixed path", () => {
    expect(withBasePath("/holidays/images/a.png")).toBe(
      "/holidays/images/a.png",
    );
  });

  it("leaves absolute URLs alone", () => {
    expect(withBasePath("https://cdn.marzi.life/x.jpg")).toBe(
      "https://cdn.marzi.life/x.jpg",
    );
  });
});

describe("canonicalUrl", () => {
  it("builds the public marzi.life URL for a route", () => {
    expect(canonicalUrl("/packages/ladakh")).toBe(
      "https://marzi.life/holidays/packages/ladakh",
    );
  });

  it("maps the home route to the bare mount point", () => {
    expect(canonicalUrl("/")).toBe("https://marzi.life/holidays");
  });
});

describe("imageSrc", () => {
  it("prefixes a root-relative next/image src (the optimizer 400s on an un-prefixed one)", () => {
    expect(imageSrc("/images/destinations/kashmir.jpg")).toBe(
      "/holidays/images/destinations/kashmir.jpg",
    );
  });

  it("leaves CDN and backend absolute URLs alone", () => {
    expect(imageSrc("https://cdn.marzi.life/x.jpg")).toBe(
      "https://cdn.marzi.life/x.jpg",
    );
  });

  it("does not double-prefix", () => {
    expect(imageSrc("/holidays/images/a.png")).toBe("/holidays/images/a.png");
  });

  it("passes a static import object through untouched", () => {
    const imported = { src: "/_next/static/media/a.png", height: 1, width: 1 };
    expect(imageSrc(imported)).toBe(imported);
  });
});
