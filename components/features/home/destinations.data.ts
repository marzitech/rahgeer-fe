export const TABS = [
  "All",
  "International",
  "India",
  "Spiritual",
  "Mountains",
  "Beaches",
  "Wellness",
  "First International Trip",
] as const;

export type Tab = (typeof TABS)[number];

// Uniform card copy per the design.
export const CARD_BLURB =
  "Curated itineraries designed for your pace, comfort, and curiosity.";

export type HomeDestination = {
  name: string;
  slug: string;
  image: string;
  tags: Tab[];
  cta: "View packages" | "Read travel guide" | "Plan this trip";
  priceFromInr?: number;
};

/** Home destination cards. Those with `priceFromInr` are curated packages
 *  (surfaced in "Curated Trips"); the rest are travel guides. All appear in
 *  the "Explore destinations" grid. */
export const DESTINATIONS: HomeDestination[] = [
  // --- Curated packages (priced) ------------------------------------------
  {
    name: "Kashmir",
    slug: "kashmir",
    image: "/images/destinations/kashmir.jpg",
    tags: ["India", "Mountains"],
    cta: "View packages",
    priceFromInr: 34999,
  },
  {
    name: "Ayodhya · Varanasi · Sarnath",
    slug: "ayodhya-varanasi-sarnath",
    // TODO(assets): swap in a real Varanasi/Ganga-ghat photo.
    image: "/images/home/review-trip-1.jpg",
    tags: ["India", "Spiritual"],
    cta: "View packages",
    priceFromInr: 21999,
  },
  {
    name: "Vietnam",
    slug: "vietnam",
    image: "/images/destinations/vietnam.jpg",
    tags: ["International", "First International Trip"],
    cta: "View packages",
    priceFromInr: 164999,
  },
  // --- Travel guides / sample itineraries ---------------------------------
  // TODO(assets): most of these reuse placeholder photos — swap in real
  // destination images under public/images/destinations/.
  {
    name: "North East",
    slug: "north-east",
    image: "/images/destinations/kerala.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Goa",
    slug: "goa",
    image: "/images/destinations/goa.jpg",
    tags: ["India", "Beaches"],
    cta: "Plan this trip",
  },
  {
    name: "Himachal",
    slug: "himachal",
    image: "/images/destinations/himachal.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Karnataka & Coorg",
    slug: "karnataka-coorg",
    image: "/images/destinations/coorg.jpg",
    tags: ["India", "Wellness"],
    cta: "Plan this trip",
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    image: "/images/destinations/rajasthan.jpg",
    tags: ["India", "Spiritual"],
    cta: "Plan this trip",
  },
  {
    name: "Gujarat",
    slug: "gujarat",
    image: "/images/destinations/rajasthan.jpg",
    tags: ["India", "Spiritual"],
    cta: "Plan this trip",
  },
  {
    name: "Sikkim & Darjeeling",
    slug: "sikkim-darjeeling",
    image: "/images/home/review-trip-2.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Tamil Nadu",
    slug: "tamil-nadu",
    image: "/images/home/review-trip-1.jpg",
    tags: ["India", "Spiritual"],
    cta: "Plan this trip",
  },
  {
    name: "Kerala",
    slug: "kerala",
    image: "/images/destinations/kerala.jpg",
    tags: ["India", "Wellness", "Beaches"],
    cta: "Plan this trip",
  },
  {
    name: "Sri Lanka",
    slug: "sri-lanka",
    image: "/images/destinations/vietnam.jpg",
    tags: ["International", "First International Trip", "Beaches"],
    cta: "Plan this trip",
  },
  {
    name: "Ladakh",
    slug: "ladakh",
    image: "/images/destinations/kashmir.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Dharamshala & Amritsar",
    slug: "dharamshala-amritsar",
    image: "/images/destinations/kashmir.jpg",
    tags: ["India", "Spiritual", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Sikkim, Darjeeling & Gangtok",
    slug: "sikkim-darjeeling-gangtok",
    image: "/images/home/review-trip-2.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
  {
    name: "Nainital",
    slug: "nainital",
    image: "/images/destinations/europe.jpg",
    tags: ["India", "Mountains"],
    cta: "Plan this trip",
  },
];

/** The curated packages — priced trips shown in "Curated Trips". */
export const PACKAGES: HomeDestination[] = DESTINATIONS.filter(
  (d) => d.priceFromInr !== undefined,
);

/** Travel guides — shown in "Explore destinations" (packages live in their
 *  own "Curated Trips" section, so they're excluded here). */
export const GUIDES: HomeDestination[] = DESTINATIONS.filter(
  (d) => d.priceFromInr === undefined,
);
