import { describe, expect, it } from "vitest";
import {
  FALLBACK_FEATURES,
  FALLBACK_HERO_BANNERS,
  normalizeHomeContent,
} from "./home-content";

describe("normalizeHomeContent", () => {
  it("maps the backend shape onto what the page renders", () => {
    const content = normalizeHomeContent({
      hero_banners: [
        {
          id: "1",
          image_url: "https://cdn.example/paris.jpg",
          alt: "Couple in Paris",
          headline: "A Life Well Lived Deserves Journeys Well Planned.",
          caption: "Mrs. & Mr. Pandya in Paris for their 30th Anniversary",
          badge_text: "ONLY FOR 50 & ABOVE",
          cta_label: "Plan my trip",
          cta_href: "/enquiry",
        },
      ],
      features: [
        {
          id: "2",
          icon: "guide",
          title: "Experienced Indian Tour Guide",
          description: "Local experts who speak your language.",
        },
      ],
    });

    expect(content.heroBanners).toEqual([
      {
        id: "1",
        imageUrl: "https://cdn.example/paris.jpg",
        alt: "Couple in Paris",
        headline: "A Life Well Lived Deserves Journeys Well Planned.",
        caption: "Mrs. & Mr. Pandya in Paris for their 30th Anniversary",
        badgeText: "ONLY FOR 50 & ABOVE",
        ctaLabel: "Plan my trip",
        ctaHref: "/enquiry",
      },
    ]);
    expect(content.features[0].title).toBe("Experienced Indian Tour Guide");
  });

  it("drops a slide with no image instead of rendering an empty frame", () => {
    const content = normalizeHomeContent({
      hero_banners: [
        { id: "1", image_url: "" },
        { id: "2", image_url: "https://cdn.example/real.jpg" },
      ],
      features: FALLBACK_FEATURES.map((f) => ({ ...f, icon: f.icon })),
    });

    expect(content.heroBanners.map((b) => b.id)).toEqual(["2"]);
  });

  it("drops a feature with no title", () => {
    const content = normalizeHomeContent({
      hero_banners: [],
      features: [
        { id: "1", title: "", description: "orphan" },
        { id: "2", title: "Real one", description: "" },
      ],
    });

    expect(content.features.map((f) => f.title)).toEqual(["Real one"]);
  });

  it("falls back per list when the backend has nothing published", () => {
    // A hero with no slides is a broken-looking page, so the bundled
    // content stands in rather than leaving a gap.
    const content = normalizeHomeContent({ hero_banners: [], features: [] });

    expect(content.heroBanners).toEqual(FALLBACK_HERO_BANNERS);
    expect(content.features).toEqual(FALLBACK_FEATURES);
  });

  it("falls back completely when the payload is missing or malformed", () => {
    for (const payload of [null, undefined, {}, "nope", { hero_banners: "x", features: 3 }]) {
      const content = normalizeHomeContent(payload);
      expect(content.heroBanners).toEqual(FALLBACK_HERO_BANNERS);
      expect(content.features).toEqual(FALLBACK_FEATURES);
    }
  });

  it("tolerates missing optional fields on an otherwise good row", () => {
    const content = normalizeHomeContent({
      hero_banners: [{ id: "1", image_url: "https://cdn.example/a.jpg" }],
      features: [{ id: "2", title: "Only a title" }],
    });

    expect(content.heroBanners[0]).toMatchObject({ headline: "", badgeText: "", ctaHref: "" });
    expect(content.features[0]).toMatchObject({ description: "", icon: "" });
  });
});
