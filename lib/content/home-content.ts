/**
 * Home-page content that the travel desk edits in the admin dashboard.
 *
 * The backend is the source of truth, but it is never allowed to take the
 * page down: every read falls back to the bundled content below, so a
 * backend outage or an empty table shows last-known-good copy instead of
 * a gap where the hero should be.
 */

export type HeroBanner = {
  id: string;
  imageUrl: string;
  alt: string;
  headline: string;
  caption: string;
  badgeText: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SiteFeature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

/** The face on the "Talk to an Expert" card. */
export type Expert = {
  name: string;
  photoUrl: string;
};

export type HomeContent = {
  heroBanners: HeroBanner[];
  features: SiteFeature[];
  faqs: FaqEntry[];
  expert: Expert;
};

/** Shown when the backend has nothing published, or cannot be reached. */
export const FALLBACK_HERO_BANNERS: HeroBanner[] = [
  {
    id: "fallback-hero",
    imageUrl: "/images/figma/hero-paris.jpg",
    alt: "A couple travelling together in Paris",
    headline: "A Life Well Lived Deserves Journeys Well Planned.",
    caption: "",
    badgeText: "Coolest Community For 50+",
    ctaLabel: "",
    ctaHref: "",
  },
];

export const FALLBACK_FEATURES: SiteFeature[] = [
  {
    id: "fallback-indian-tour-guide",
    icon: "guide",
    title: "A Personal Travel Guide",
    description:
      "An experienced tour manager along the way, handling the details for you.",
  },
  {
    id: "fallback-personalised-trip-planning",
    icon: "planning",
    title: "Personalised Trip Planning",
    description:
      "Solo, as a couple or with a group, we plan the trip around your pace.",
  },
  {
    id: "fallback-doctor-support",
    icon: "doctor",
    title: "24x7 Medical Support",
    description:
      "A health check before you leave, and a doctor on call at any hour.",
  },
  {
    id: "fallback-door-to-door",
    icon: "door",
    title: "Door-to-door Transfers",
    description:
      "From your home to the airport, the airport to your hotel, and back again.",
  },
  {
    id: "fallback-familiar-meals",
    icon: "meals",
    title: "All Meals Included",
    description:
      "Three meals a day, with Indian and local vegetarian options included.",
  },
  {
    id: "fallback-flights-hotels-visas",
    icon: "flight",
    title: "Flights, Hotels & Visas",
    description:
      "Flights, hotels, visas, forex and insurance, all taken care of.",
  },
];

/**
 * The portrait the site shipped with.
 *
 * Stands in until a Travel Mitr with a photo is on the roster. The card
 * is the only face on the home page, so it must never be empty — a Mitr
 * added but not yet photographed should not blank it.
 */
export const FALLBACK_EXPERT: Expert = {
  name: "A Marzi travel expert",
  photoUrl: "/images/figma/expert-portrait.png",
};

/**
 * The questions the site shipped with.
 *
 * Kept as the fallback rather than deleted: the accordion is the last
 * thing on the page that answers "is this for me?", and an outage that
 * empties it costs a booking. The dashboard's list wins whenever it has
 * one.
 */
export const FALLBACK_FAQS: FaqEntry[] = [
  {
    id: "fallback-who-is-marzi-holidays-for",
    question: "Who is Marzi Holidays for?",
    answer:
      "People over 50 who want a comfortable, well-planned holiday, in India or abroad. Many adult children also come to us to plan a trip for their parents.",
  },
  {
    id: "fallback-what-is-a-travel-mitr",
    question: "What is a Travel Mitr?",
    answer:
      "Your Travel Mitr is one person who plans, books and coordinates your whole holiday. You speak to the same person from your first call until you're back home.",
  },
  {
    id: "fallback-is-trip-planning-really-free",
    question: "Is trip planning really free?",
    answer:
      "Yes. Talking to your Travel Mitr and planning your trip costs nothing. You pay only for the bookings you confirm.",
  },
  {
    id: "fallback-what-is-the-pre-travel-health-assessment",
    question: "What is the Pre-Travel Health Assessment?",
    answer:
      "A short conversation before you travel about your medications, mobility and any medical needs. It helps us plan a trip that's safe and comfortable for you.",
  },
  {
    id: "fallback-what-happens-if-there-s-a-medical-emergency-during-the-trip",
    question: "What happens if there's a medical emergency during the trip?",
    answer:
      "A doctor is on call 24x7, and we map the nearest hospitals along your route before you leave. On group tours, your tour manager also carries a first-aid kit.",
  },
  {
    id: "fallback-will-the-hotels-and-transport-be-comfortable-for-seniors",
    question: "Will the hotels and transport be comfortable?",
    answer:
      "Yes. We choose hotels with lifts and easy access, and transport with help boarding. Walking distances and steps are planned for each day, at an unhurried pace.",
  },
  {
    id: "fallback-can-marzi-cater-to-special-dietary-needs",
    question: "Can Marzi cater to special dietary needs?",
    answer:
      "Yes. Diabetic, Jain, vegetarian or low-salt, we plan your meals around what you need, wherever you are.",
  },
  {
    id: "fallback-does-marzi-handle-visas-forex-insurance-and-paperwork",
    question: "Does Marzi handle visas, forex, insurance and paperwork?",
    answer:
      "Yes, all in one place. We arrange travel insurance and explain what it covers in plain language, including pre-existing conditions. Visa processing costs nothing extra, and there are no hidden charges.",
  },
  {
    id: "fallback-can-i-plan-a-holiday-for-my-parents-and-stay-updated",
    question: "Can I plan a holiday for my parents and stay updated?",
    answer:
      "Yes. We keep you posted throughout the trip and call you straight away if anything goes wrong.",
  },
  {
    id: "fallback-never-travelled-abroad",
    question: "I've never travelled abroad before. Can Marzi still help?",
    answer:
      "Yes. Before you leave, we take you through packing, documents and what to expect. Your Travel Mitr is there for every question along the way.",
  },
  {
    id: "fallback-why-should-i-trust-marzi-holidays",
    question: "Why should I trust Marzi Holidays?",
    answer:
      "Marzi is backed by Primus Senior Living, and we plan around your health, comfort and safety first. That care starts before you book and continues until you're home.",
  },
];

/** Narrow an unknown value to a string without throwing on nulls/numbers. */
function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toBanner(raw: unknown, index: number): HeroBanner | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const imageUrl = str(row.image_url);
  // A slide is its photo. Without one there is nothing to show.
  if (!imageUrl) return null;
  return {
    id: str(row.id) || `banner-${index}`,
    imageUrl,
    alt: str(row.alt),
    headline: str(row.headline),
    caption: str(row.caption),
    badgeText: str(row.badge_text),
    ctaLabel: str(row.cta_label),
    ctaHref: str(row.cta_href),
  };
}

/**
 * The first Mitr on the roster who has a photo.
 *
 * Who fronts the page is an ops decision — the roster is ordered in the
 * dashboard, and the top of it is who the card shows.
 */
function toExpert(raw: unknown): Expert {
  if (!Array.isArray(raw)) return FALLBACK_EXPERT;
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const mitr = row as Record<string, unknown>;
    const photoUrl = str(mitr.photo_url);
    if (photoUrl) return { name: str(mitr.name) || FALLBACK_EXPERT.name, photoUrl };
  }
  return FALLBACK_EXPERT;
}

function toFaq(raw: unknown, index: number): FaqEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const question = str(row.question);
  // A row is its question; an answer with nothing to answer is a blank
  // accordion header nobody can open.
  if (!question) return null;
  return { id: str(row.id) || `faq-${index}`, question, answer: str(row.answer) };
}

function toFeature(raw: unknown, index: number): SiteFeature | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const title = str(row.title);
  if (!title) return null;
  return {
    id: str(row.id) || `feature-${index}`,
    icon: str(row.icon),
    title,
    description: str(row.description),
  };
}

/**
 * Turn whatever the backend returned into something renderable.
 *
 * Per list, not all-or-nothing: published banners still show even if the
 * features table is empty, and vice versa.
 */
export function normalizeHomeContent(payload: unknown): HomeContent {
  const root = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  const banners = Array.isArray(root.hero_banners)
    ? root.hero_banners.map(toBanner).filter((b): b is HeroBanner => b !== null)
    : [];
  const features = Array.isArray(root.features)
    ? root.features.map(toFeature).filter((f): f is SiteFeature => f !== null)
    : [];
  const faqs = Array.isArray(root.faqs)
    ? root.faqs.map(toFaq).filter((f): f is FaqEntry => f !== null)
    : [];

  return {
    heroBanners: banners.length > 0 ? banners : FALLBACK_HERO_BANNERS,
    features: features.length > 0 ? features : FALLBACK_FEATURES,
    faqs: faqs.length > 0 ? faqs : FALLBACK_FAQS,
    expert: toExpert(root.travel_mitrs),
  };
}

export type CaptionRun = { text: string; emphasis: boolean };

/**
 * Split a caption into plain and emphasised runs.
 *
 * The design prints part of the hero caption in the brand colour — "…for
 * their **30th Anniversary**". Which part is editorial, so the dashboard
 * marks it by wrapping it in asterisks rather than the site guessing.
 *
 * Only balanced pairs count: a lone "*" is ordinary text, so a caption
 * like "5 * 4 people" is not swallowed into an emphasis that never ends.
 */
export function splitCaption(caption: string): CaptionRun[] {
  if (!caption) return [];

  const runs: CaptionRun[] = [];
  let rest = caption;

  while (rest.length > 0) {
    const open = rest.indexOf("*");
    const close = open === -1 ? -1 : rest.indexOf("*", open + 1);
    if (open === -1 || close === -1) break;

    if (open > 0) runs.push({ text: rest.slice(0, open), emphasis: false });
    runs.push({ text: rest.slice(open + 1, close), emphasis: true });
    rest = rest.slice(close + 1);
  }

  if (rest.length > 0) runs.push({ text: rest, emphasis: false });
  return runs;
}
