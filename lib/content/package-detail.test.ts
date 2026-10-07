import { describe, expect, it } from "vitest";
import { normalizePackageDetail } from "./package-detail";

const ROW = {
  id: "1",
  slug: "kashmir",
  display_name: "Kashmir",
  title: "Kashmir - Srinagar, Pahalgam & Gulmarg",
  destination: "Kashmir",
  summary: "Houseboats and meadows.",
  card_image_url: "https://cdn.example/card.jpg",
  hero_image_urls: ["https://cdn.example/a.jpg", "https://cdn.example/b.jpg"],
  duration_label: "4 Nights 5 Days",
  dates_label: "25-29 September",
  package_type: "Land Package Only",
  meals_label: "All Meals Included",
  places_covered: ["Srinagar", "Pahalgam", "Gulmarg"],
  price_from_inr: 59999,
  content: {
    why_tour_with_marzi: [{ term: "Indian tour guide", description: "Speaks Hindi." }],
    highlights: [{ term: "Dal Lake", description: "Shikara at sunset." }],
    days: [
      {
        day: 1,
        title: "Arrive Srinagar",
        description: "Settle in.",
        stops: [
          {
            time: "5 PM",
            title: "Shikara ride",
            description: "Calm.",
            image: "/images/destinations/kashmir.jpg",
          },
        ],
      },
    ],
    price_includes: ["All meals"],
    price_excludes: ["Personal expenses"],
  },
};

describe("normalizePackageDetail", () => {
  it("maps the detail endpoint onto what the page renders", () => {
    const pkg = normalizePackageDetail(ROW)!;

    expect(pkg).toMatchObject({
      slug: "kashmir",
      title: "Kashmir - Srinagar, Pahalgam & Gulmarg",
      datesLabel: "25-29 September",
      durationLabel: "4 Nights 5 Days",
      packageType: "Land Package Only",
      mealsLabel: "All Meals Included",
      placesCovered: ["Srinagar", "Pahalgam", "Gulmarg"],
      priceFromInr: 59999,
    });
    expect(pkg.days[0].stops[0].title).toBe("Shikara ride");
    expect(pkg.days[0].stops[0].image).toBe("/images/destinations/kashmir.jpg");
    expect(pkg.highlights[0].term).toBe("Dal Lake");
  });

  it("falls back to the display name when no full title is set", () => {
    const pkg = normalizePackageDetail({ ...ROW, title: "" })!;
    expect(pkg.title).toBe("Kashmir");
  });

  it("leads the gallery with the card image so the hero is never empty", () => {
    // Ops uploads the card image first and the gallery later; the hero
    // has to show something in between.
    const pkg = normalizePackageDetail({ ...ROW, hero_image_urls: [] })!;
    expect(pkg.gallery).toEqual(["https://cdn.example/card.jpg"]);
  });

  it("does not duplicate the card image when it already leads the gallery", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      hero_image_urls: ["https://cdn.example/card.jpg", "https://cdn.example/b.jpg"],
    })!;
    expect(pkg.gallery).toEqual([
      "https://cdn.example/card.jpg",
      "https://cdn.example/b.jpg",
    ]);
  });

  it("renumbers days so the tabs read 1..n whatever the data says", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      content: { ...ROW.content, days: [{ day: 7, title: "A", stops: [] }, { day: 9, title: "B", stops: [] }] },
    })!;
    expect(pkg.days.map((d) => d.day)).toEqual([1, 2]);
  });

  it("survives a package saved before the content lists existed", () => {
    const pkg = normalizePackageDetail({ ...ROW, content: {} })!;
    expect(pkg.days).toEqual([]);
    expect(pkg.highlights).toEqual([]);
    expect(pkg.whyTour).toEqual([]);
    expect(pkg.priceIncludes).toEqual([]);
  });

  it("returns null for anything that is not a package", () => {
    for (const bad of [null, undefined, {}, "nope", { slug: "" }]) {
      expect(normalizePackageDetail(bad)).toBeNull();
    }
  });
});

describe("itinerary stop images", () => {
  it("defaults to no image rather than undefined, so the check is simple", () => {
    const pkg = normalizePackageDetail({
      slug: "x",
      display_name: "X",
      content: { days: [{ day: 1, title: "A", stops: [{ title: "S" }] }] },
    })!;
    expect(pkg.days[0].stops[0].image).toBe("");
  });
});
