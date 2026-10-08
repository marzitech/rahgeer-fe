import { describe, expect, it } from "vitest";
import { formatPriceInr, normalizeTrips } from "./trips";

const ROW = {
  id: "1",
  slug: "kashmir",
  display_name: "Kashmir",
  title: "Kashmir — Srinagar, Pahalgam & Gulmarg",
  card_image_url: "https://cdn.example/kashmir.jpg",
  duration_label: "7 Days 6 Nights",
  group_size_label: "5 people",
  dates_label: "20-25 Dec. 2026",
  price_from_inr: 125000,
  tags: ["India", "Mountains"],
};

describe("normalizeTrips", () => {
  it("maps the packages endpoint onto trip cards", () => {
    const [trip] = normalizeTrips({ results: [ROW] });

    expect(trip).toMatchObject({
      slug: "kashmir",
      name: "Kashmir",
      imageUrl: "https://cdn.example/kashmir.jpg",
      durationLabel: "7 Days 6 Nights",
      groupSizeLabel: "5 people",
      datesLabel: "20-25 Dec. 2026",
      priceFromInr: 125000,
      href: "/packages/kashmir",
    });
  });

  it("accepts a bare array as well as a paginated envelope", () => {
    expect(normalizeTrips([ROW])).toHaveLength(1);
    expect(normalizeTrips({ results: [ROW] })).toHaveLength(1);
  });

  it("drops a row with no slug, since its card could not link anywhere", () => {
    expect(normalizeTrips({ results: [{ ...ROW, slug: "" }] })).toEqual([]);
  });

  it("returns nothing rather than throwing on a malformed payload", () => {
    for (const payload of [null, undefined, {}, "nope", { results: "x" }]) {
      expect(normalizeTrips(payload)).toEqual([]);
    }
  });

  it("keeps a trip whose photo has not been uploaded yet", () => {
    // Ops adds the package first and the creative later; the card shows a
    // placeholder rather than vanishing from the rail.
    const [trip] = normalizeTrips({ results: [{ ...ROW, card_image_url: "" }] });
    expect(trip.imageUrl).toBe("");
    expect(trip.slug).toBe("kashmir");
  });
});

describe("formatPriceInr", () => {
  it("writes prices the way the design does", () => {
    expect(formatPriceInr(125000)).toBe("₹1,25,000");
    expect(formatPriceInr(34999)).toBe("₹34,999");
  });

  it("says nothing when there is no price", () => {
    expect(formatPriceInr(null)).toBe("");
    expect(formatPriceInr(0)).toBe("");
  });
});
