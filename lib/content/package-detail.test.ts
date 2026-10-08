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

describe("what the price covers", () => {
  it("keeps the icon the dashboard chose for each line", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      content: {
        price_includes: [{ icon: "hotel", label: "Hotel stay" }],
        price_excludes: [{ icon: "flight", label: "Flight tickets" }],
      },
    })!;

    expect(pkg.priceIncludes).toEqual([{ icon: "hotel", label: "Hotel stay" }]);
    expect(pkg.priceExcludes).toEqual([{ icon: "flight", label: "Flight tickets" }]);
  });

  it("reads a plain list of strings too", () => {
    // The bundled fallback content for the original eight tours holds
    // strings, and so does anything written straight to the API. An
    // unlabelled line still beats dropping it.
    const pkg = normalizePackageDetail({
      ...ROW,
      content: { price_includes: ["All meals", "Private transfers"] },
    })!;

    expect(pkg.priceIncludes).toEqual([
      { icon: "", label: "All meals" },
      { icon: "", label: "Private transfers" },
    ]);
  });

  it("drops a line with no words, which would render as an empty bullet", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      content: { price_includes: [{ icon: "hotel", label: "" }, "", { label: "Visa" }] },
    })!;

    expect(pkg.priceIncludes).toEqual([{ icon: "", label: "Visa" }]);
  });
});

describe("the cancellation policy", () => {
  it("maps each clause onto a heading and its wording", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      content: {
        cancellation_policy: [
          { title: "Booking & payments", body: "Full payment confirms your booking." },
        ],
      },
    })!;

    expect(pkg.cancellationPolicy).toEqual([
      { title: "Booking & payments", body: "Full payment confirms your booking." },
    ]);
  });

  it("is empty rather than undefined when a tour has none, so the section can be hidden", () => {
    expect(normalizePackageDetail(ROW)!.cancellationPolicy).toEqual([]);
  });

  it("keeps a clause that has wording but no heading", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      content: { cancellation_policy: [{ body: "Refunds take 14 days." }, {}] },
    })!;

    expect(pkg.cancellationPolicy).toEqual([{ title: "", body: "Refunds take 14 days." }]);
  });
});

describe("travel mitr", () => {
  it("maps the assigned guide onto the page's shape", () => {
    const pkg = normalizePackageDetail({
      ...ROW,
      travel_mitr: {
        name: "Naveen",
        photo_url: "/images/figma/expert-nabeel.webp",
        languages: "English · Hindi · Kannada",
        trips_label: "150+ Trips completed",
      },
    })!;
    expect(pkg.travelMitr).toEqual({
      name: "Naveen",
      photoUrl: "/images/figma/expert-nabeel.webp",
      languages: "English · Hindi · Kannada",
      tripsLabel: "150+ Trips completed",
    });
  });

  it("is null when no guide is assigned, so the card can be hidden", () => {
    expect(normalizePackageDetail({ ...ROW, travel_mitr: null })!.travelMitr).toBeNull();
    expect(normalizePackageDetail(ROW)!.travelMitr).toBeNull();
  });

  it("ignores a guide with no name rather than rendering a blank card", () => {
    const pkg = normalizePackageDetail({ ...ROW, travel_mitr: { name: "", photo_url: "x" } })!;
    expect(pkg.travelMitr).toBeNull();
  });
});
