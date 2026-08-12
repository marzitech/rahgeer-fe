/**
 * Destination page content (design: Figma node 3541-27094).
 *
 * The design's copy structure per destination: hero tagline, gentle-pace
 * intro, quick highlights, why-visit, know-before-you-go Q&As, featured
 * itineraries. Japan's featured itineraries carry the design's exact copy;
 * other destinations follow the same structure — content team to refine.
 */

export type FeaturedItinerary = {
  name: string;
  meta: string; // "Tokyo, Kyoto & Osaka · 7 Days"
  description: string;
  priceFromInr: number;
  image: string;
};

export type DestinationContent = {
  name: string;
  slug: string;
  image: string;
  /** "packages" -> shows Choose Package That Feels Right; "guide" -> editorial only */
  kind: "packages" | "guide";
  heroTagline: string;
  intro: string;
  highlights: { label: string; value: string }[];
  whyVisit: string;
  knowBeforeYouGo: { question: string; answer: string }[];
  featured: FeaturedItinerary[];
};

const SHARED_QAS = (name: string) => [
  {
    question: "How much walking is involved?",
    answer:
      "Most sightseeing can be planned at a comfortable pace, though some sights may involve gentle walking.",
  },
  {
    question: `Is ${name} suitable for older travellers?`,
    answer:
      "Yes, with the right itinerary, comfortable hotels and enough rest between activities.",
  },
  {
    question: "What kind of weather should I expect?",
    answer: "Weather varies by season, so layered clothing is recommended.",
  },
  {
    question: "Can the trip be personalised?",
    answer:
      "A Travel Mitr can help shape the journey around your preferred pace and interests.",
  },
];

export const DESTINATION_CONTENT: Record<string, DestinationContent> = {
  europe: {
    name: "Europe",
    slug: "europe",
    kind: "packages",
    image: "/images/destinations/europe.jpg",
    heroTagline:
      "Experience Europe through a thoughtfully planned journey that balances culture, comfort, sightseeing and time to relax.",
    intro:
      "From grand cities and scenic rail journeys to quiet lakeside towns, Europe is ideal for travellers looking for a rich yet unhurried holiday.",
    highlights: [
      { label: "Best time", value: "April–June and September–October" },
      { label: "Ideal duration", value: "8–12 days" },
      {
        label: "Best for",
        value:
          "Couples, culture lovers and first-time international travellers",
      },
      { label: "Travel pace", value: "Relaxed to moderate" },
    ],
    whyVisit:
      "Europe offers a timeless travel experience shaped by history, art and landscape. Comfortable trains, walkable towns and thoughtfully preserved heritage make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Europe"),
    featured: [
      {
        name: "European Classics",
        meta: "Zurich, Lucerne & Paris · 9 Days",
        description:
          "A slower journey with fewer hotel changes, scenic experiences and extra time to rest.",
        priceFromInr: 56302,
        image: "/images/destinations/europe.jpg",
      },
    ],
  },
  kashmir: {
    name: "Kashmir",
    slug: "kashmir",
    kind: "packages",
    image: "/images/destinations/kashmir.jpg",
    heroTagline:
      "Experience Kashmir through a thoughtfully planned journey that balances nature, comfort, sightseeing and time to relax.",
    intro:
      "From houseboats on Dal Lake to gardens and mountain meadows, Kashmir is ideal for travellers looking for a calm and scenic holiday.",
    highlights: [
      { label: "Best time", value: "March–October" },
      { label: "Ideal duration", value: "5–7 days" },
      { label: "Best for", value: "Couples, families and nature lovers" },
      { label: "Travel pace", value: "Relaxed" },
    ],
    whyVisit:
      "Kashmir offers a gentler travel experience shaped by natural beauty and warm hospitality. Short drives, lakeside stays and unhurried gardens make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Kashmir"),
    featured: [
      {
        name: "Kashmir Essentials",
        meta: "Srinagar, Gulmarg & Pahalgam · 6 Days",
        description:
          "A slower journey with fewer hotel changes, scenic experiences and extra time to rest.",
        priceFromInr: 56302,
        image: "/images/destinations/kashmir.jpg",
      },
    ],
  },
  japan: {
    name: "Japan",
    slug: "japan",
    kind: "guide",
    image: "/images/destinations/japan.jpg",
    heroTagline:
      "Experience Japan through a thoughtfully planned journey that balances culture, comfort, sightseeing and time to relax.",
    intro:
      "From peaceful temples and gardens to welcoming local traditions, Japan is ideal for travellers looking for a calm and meaningful holiday.",
    highlights: [
      { label: "Best time", value: "March–May and September–November" },
      { label: "Ideal duration", value: "6–8 days" },
      {
        label: "Best for",
        value: "Couples, nature lovers and spiritual travellers",
      },
      { label: "Travel pace", value: "Relaxed to moderate" },
    ],
    whyVisit:
      "Japan offers a quieter travel experience shaped by natural beauty, culture and simplicity. Its scenic drives, peaceful towns and thoughtfully preserved traditions make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Japan"),
    featured: [
      {
        name: "Japan Essentials",
        meta: "Tokyo, Kyoto & Osaka · 7 Days",
        description:
          "A slower journey with fewer hotel changes, scenic experiences and extra time to rest.",
        priceFromInr: 56302,
        image: "/images/destinations/japan.jpg",
      },
      {
        name: "Japan at a Relaxed Pace",
        meta: "Tokyo, Hakone & Kyoto · 9 Days",
        description:
          "A slower journey with fewer hotel changes, scenic experiences and extra time to rest.",
        priceFromInr: 76412,
        image: "/images/destinations/japan.jpg",
      },
    ],
  },
  kerala: {
    name: "Kerala",
    slug: "kerala",
    kind: "guide",
    image: "/images/destinations/kerala.jpg",
    heroTagline:
      "Experience Kerala through a thoughtfully planned journey that balances backwaters, comfort, wellness and time to relax.",
    intro:
      "From tranquil backwaters to ayurveda retreats and spice gardens, Kerala is ideal for travellers looking for a slow and restorative holiday.",
    highlights: [
      { label: "Best time", value: "September–March" },
      { label: "Ideal duration", value: "5–7 days" },
      { label: "Best for", value: "Couples, wellness seekers and families" },
      { label: "Travel pace", value: "Relaxed" },
    ],
    whyVisit:
      "Kerala offers a soothing travel experience shaped by water, greenery and wellness traditions. Houseboat stays, gentle cruises and unhurried mornings make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Kerala"),
    featured: [],
  },
  vietnam: {
    name: "Vietnam",
    slug: "vietnam",
    kind: "guide",
    image: "/images/destinations/vietnam.jpg",
    heroTagline:
      "Experience Vietnam through a thoughtfully planned journey that balances culture, comfort, sightseeing and time to relax.",
    intro:
      "From limestone bays to lantern-lit old towns, Vietnam is ideal for travellers looking for gentle adventure on a first trip beyond the familiar.",
    highlights: [
      { label: "Best time", value: "November–April" },
      { label: "Ideal duration", value: "6–8 days" },
      {
        label: "Best for",
        value: "Couples and first-time international travellers",
      },
      { label: "Travel pace", value: "Relaxed to moderate" },
    ],
    whyVisit:
      "Vietnam offers an easygoing travel experience shaped by scenery, food and friendly towns. Cruises, short transfers and comfortable stays make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Vietnam"),
    featured: [],
  },
  rajasthan: {
    name: "Rajasthan",
    slug: "rajasthan",
    kind: "guide",
    image: "/images/destinations/rajasthan.jpg",
    heroTagline:
      "Experience Rajasthan through a thoughtfully planned journey that balances heritage, comfort, sightseeing and time to relax.",
    intro:
      "From palace stays to desert sunsets and living bazaars, Rajasthan is ideal for travellers looking for royal comfort at an easy pace.",
    highlights: [
      { label: "Best time", value: "October–March" },
      { label: "Ideal duration", value: "6–9 days" },
      { label: "Best for", value: "Couples, families and heritage lovers" },
      { label: "Travel pace", value: "Relaxed to moderate" },
    ],
    whyVisit:
      "Rajasthan offers a regal travel experience shaped by forts, palaces and desert landscapes. Heritage hotels, short city hops and curated experiences make it especially suitable for travellers who prefer meaningful experiences over rushed sightseeing.",
    knowBeforeYouGo: SHARED_QAS("Rajasthan"),
    featured: [],
  },
};
