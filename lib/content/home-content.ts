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

export type HomeContent = {
  heroBanners: HeroBanner[];
  features: SiteFeature[];
  faqs: FaqEntry[];
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
    id: "fallback-guide",
    icon: "guide",
    title: "Experienced Indian Tour Guide",
    description: "Local experts who speak your language and know the hidden gems.",
  },
  {
    id: "fallback-doctor",
    icon: "doctor",
    title: "24X7 Doctor Support",
    description: "Medical assistance available at your fingertips, anywhere in the world.",
  },
  {
    id: "fallback-meals",
    icon: "meals",
    title: "Three Familiar Meals Everyday",
    description: "Enjoy home-style Indian cuisine at every meal, no matter where you are.",
  },
  {
    id: "fallback-solo",
    icon: "solo",
    title: "Safe for Solo Travellers",
    description: "Group travel designed for safety and companionship.",
  },
  {
    id: "fallback-door",
    icon: "door",
    title: "Door to Door Coordination",
    description: "We handle every detail from airport pickup to drop-off.",
  },
];

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
    id: "fallback-faq-0",
    question: "Who is Marzi Holidays for?",
    answer:
      "People above 50 who want a comfortable, well-planned holiday — in India or abroad. We also help adult children plan trips for their parents. Every journey is shaped around your pace and comfort.",
  },
  {
    id: "fallback-faq-1",
    question: "What is a Travel Mitr?",
    answer:
      "Your Travel Mitr is a dedicated Relationship Manager who plans, books, and coordinates your entire holiday. One trusted person handles everything, from your first conversation until you're back home.",
  },
  {
    id: "fallback-faq-2",
    question: "Is trip planning really free?",
    answer:
      "Yes. Speaking to your Travel Mitr and planning your holiday costs nothing. You only pay for the bookings you confirm.",
  },
  {
    id: "fallback-faq-3",
    question: "What is the Pre-Travel Health Assessment?",
    answer:
      "Before you travel, we understand your health profile — medications, mobility, and any medical needs. This helps us plan a trip that is genuinely safe and comfortable for you. It's something most travel companies simply don't do.",
  },
  {
    id: "fallback-faq-4",
    question: "What happens if there's a medical emergency during the trip?",
    answer:
      "You're never on your own. Marzi offers 24x7 doctor-on-call support, and our Indian tour managers travel with a basic first-aid box. We also keep the nearest hospitals mapped along your route, so help is always close at hand.",
  },
  {
    id: "fallback-faq-5",
    question: "Will the hotels and transport be comfortable for seniors?",
    answer:
      "Yes. We choose hotels with lifts and easy access, and arrange comfortable transport with boarding assistance. Small details like walking distances and steps each day are planned around you, with a gentle, unhurried pace.",
  },
  {
    id: "fallback-faq-6",
    question: "Can Marzi cater to special dietary needs?",
    answer:
      "Absolutely. Whether you need diabetic, Jain, vegetarian, or low-salt meals, we plan your food around your requirements. So you never have to worry about what's on your plate, even far from home.",
  },
  {
    id: "fallback-faq-7",
    question: "Does Marzi handle visas, forex, insurance and paperwork?",
    answer:
      "Yes. Visa, travel insurance, forex, and documentation are all managed for you in one place. There are no hidden costs and no extra charge for visa processing — you always know exactly what you're paying for.",
  },
  {
    id: "fallback-faq-8",
    question: "Can I plan a holiday for my parents and stay updated?",
    answer:
      "Yes. Many families come to us to plan worry-free trips for their parents. We keep you informed through the journey, and reach out promptly in case of any emergency. So you have complete peace of mind, wherever you are.",
  },
  {
    id: "fallback-faq-9",
    question: "I've never travelled abroad before. Can Marzi still help?",
    answer:
      "Of course. We guide first-time travellers gently, with a pre-trip orientation covering packing, documents, and what to expect. Your Travel Mitr is beside you from your first question to your return home.",
  },
  {
    id: "fallback-faq-10",
    question: "Do I need travel insurance, and does Marzi arrange it?",
    answer:
      "Yes, we arrange travel insurance at the best available prices. We also explain in plain language exactly what it covers — including how pre-existing conditions work — so nothing is confusing. You travel fully protected, with no fine print surprises.",
  },
  {
    id: "fallback-faq-11",
    question: "Why should I trust Marzi Holidays?",
    answer:
      "Marzi is backed by Primus Senior Living and built on a care-first philosophy. We're not just a travel company — we plan around your health, comfort, and safety, long before you leave. That care continues at every step of your journey.",
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
