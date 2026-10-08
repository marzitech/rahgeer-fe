import { describe, expect, it } from "vitest";
import { ICON_KEYS } from "./travel-icons";
import {
  FALLBACK_EXPERT,
  FALLBACK_FAQS,
  FALLBACK_FEATURES,
  FALLBACK_HERO_BANNERS,
  normalizeHomeContent,
  splitCaption,
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
      expect(content.faqs).toEqual(FALLBACK_FAQS);
      expect(content.expert).toEqual(FALLBACK_EXPERT);
    }
  });

  it("fronts the page with the first Travel Mitr on the roster", () => {
    const content = normalizeHomeContent({
      travel_mitrs: [
        {
          id: "1",
          name: "Nabeel",
          photo_url: "https://cdn.example/nabeel.webp",
          languages: "English · Hindi · Kannada",
          trips_label: "200+ Trips completed",
        },
        { id: "2", name: "Someone else", photo_url: "https://cdn.example/other.webp" },
      ],
    });

    expect(content.expert).toEqual({
      name: "Nabeel",
      photoUrl: "https://cdn.example/nabeel.webp",
      languages: "English · Hindi · Kannada",
      tripsLabel: "200+ Trips completed",
    });
  });

  it("carries the same shape a package page's own Travel Mitr card expects", () => {
    // A tour with nobody assigned falls back to this expert, card and
    // all — the fallback has to be a real TravelMitr, not just a name
    // and a photo, or the card renders with blank language/trips rows.
    const content = normalizeHomeContent({});
    expect(content.expert).toEqual({
      name: "Nabeel",
      photoUrl: "/images/figma/expert-nabeel.webp",
      languages: "English · Hindi",
      tripsLabel: "150+ Trips completed",
    });
  });

  it("keeps the bundled portrait when nobody on the roster has a photo", () => {
    // A Mitr added but not yet photographed must not blank the card —
    // it is the only face on the home page.
    const content = normalizeHomeContent({
      travel_mitrs: [{ id: "1", name: "Nabeel", photo_url: "" }],
    });

    expect(content.expert).toEqual(FALLBACK_EXPERT);
  });

  it("skips past a photoless Mitr to one who has a picture", () => {
    const content = normalizeHomeContent({
      travel_mitrs: [
        { id: "1", name: "No photo yet", photo_url: "" },
        { id: "2", name: "Nabeel", photo_url: "https://cdn.example/nabeel.webp" },
      ],
    });

    expect(content.expert.name).toBe("Nabeel");
  });

  it("maps the FAQ list the dashboard publishes", () => {
    const content = normalizeHomeContent({
      faqs: [
        { id: "9", question: "Is planning free?", answer: "Yes." },
        { id: "10", question: "What is a Travel Mitr?", answer: "Your manager." },
      ],
    });

    expect(content.faqs).toEqual([
      { id: "9", question: "Is planning free?", answer: "Yes." },
      { id: "10", question: "What is a Travel Mitr?", answer: "Your manager." },
    ]);
  });

  it("drops a question with no question, which would render as a blank row", () => {
    const content = normalizeHomeContent({
      faqs: [
        { id: "1", question: "", answer: "An answer to nothing." },
        { id: "2", question: "Real?" },
      ],
    });

    expect(content.faqs).toEqual([{ id: "2", question: "Real?", answer: "" }]);
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

describe("splitCaption", () => {
  it("marks the *starred* phrase so the design's accent colour can apply", () => {
    expect(splitCaption("Mrs. & Mr. Pandya in Paris for their *30th Anniversary*")).toEqual([
      { text: "Mrs. & Mr. Pandya in Paris for their ", emphasis: false },
      { text: "30th Anniversary", emphasis: true },
    ]);
  });

  it("leaves a caption with no stars as one plain run", () => {
    expect(splitCaption("A quiet morning in Kyoto")).toEqual([
      { text: "A quiet morning in Kyoto", emphasis: false },
    ]);
  });

  it("handles an emphasis in the middle", () => {
    expect(splitCaption("Their *silver jubilee* in Rome")).toEqual([
      { text: "Their ", emphasis: false },
      { text: "silver jubilee", emphasis: true },
      { text: " in Rome", emphasis: false },
    ]);
  });

  it("treats an unclosed star as ordinary text rather than eating the rest", () => {
    expect(splitCaption("5 * 4 people")).toEqual([{ text: "5 * 4 people", emphasis: false }]);
  });

  it("returns nothing for an empty caption", () => {
    expect(splitCaption("")).toEqual([]);
  });
});

describe("the bundled copy and the backend seed", () => {
  /**
   * These are the words production is showing right now: the deployed
   * backend does not serve /site-content/home/ yet, so every visitor
   * gets the fallbacks. When it does deploy, the seeded rows take over.
   * If the two lists disagree the site changes copy on a release that
   * touched no copy — so they are pinned here, and a change has to be
   * made on both sides deliberately.
   *
   * Kept in step with rahgeer-be `apps/sitecontent/seed_data/travel_content.json`.
   */
  it("offers the six Classic Marzi Holidays rows, in order", () => {
    expect(FALLBACK_FEATURES.map((f) => f.title)).toEqual([
      "A Personal Travel Guide",
      "Personalised Trip Planning",
      "24x7 Medical Support",
      "Door-to-door Transfers",
      "All Meals Included",
      "Flights, Hotels & Visas",
    ]);
  });

  it("gives every row an icon the site can actually render", () => {
    for (const feature of FALLBACK_FEATURES) {
      expect(ICON_KEYS).toContain(feature.icon);
    }
  });

  it("asks the eleven questions, in order", () => {
    expect(FALLBACK_FAQS.map((f) => f.question)).toEqual([
      "Who is Marzi Holidays for?",
      "What is a Travel Mitr?",
      "Is trip planning really free?",
      "What is the Pre-Travel Health Assessment?",
      "What happens if there's a medical emergency during the trip?",
      "Will the hotels and transport be comfortable?",
      "Can Marzi cater to special dietary needs?",
      "Does Marzi handle visas, forex, insurance and paperwork?",
      "Can I plan a holiday for my parents and stay updated?",
      "I've never travelled abroad before. Can Marzi still help?",
      "Why should I trust Marzi Holidays?",
    ]);
  });

  it("leaves the hero as it was", () => {
    // The hero was reverted after the copy rewrite: the standalone
    // heading, the photo caption and the original headline all stay.
    const [hero] = FALLBACK_HERO_BANNERS;
    expect(hero.headline).toBe("A Life Well Lived Deserves Journeys Well Planned.");
  });
});
