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

export type HomeContent = {
  heroBanners: HeroBanner[];
  features: SiteFeature[];
};

/** Shown when the backend has nothing published, or cannot be reached. */
export const FALLBACK_HERO_BANNERS: HeroBanner[] = [
  {
    id: "fallback-hero",
    imageUrl: "/images/home/hero-koh-tao.jpg",
    alt: "Travellers on a Marzi holiday",
    headline: "A Life Well Lived Deserves Journeys Well Planned.",
    caption: "",
    badgeText: "ONLY FOR 50 & ABOVE",
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

  return {
    heroBanners: banners.length > 0 ? banners : FALLBACK_HERO_BANNERS,
    features: features.length > 0 ? features : FALLBACK_FEATURES,
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
