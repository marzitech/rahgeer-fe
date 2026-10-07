/**
 * One curated trip, as the package page renders it.
 *
 * The backend is the source of truth; this is the page's view of a
 * package, so a serializer change touches one mapper rather than every
 * section of the page.
 */

export type PackageStop = {
  time: string;
  title: string;
  description: string;
  /** Optional photo for the stop; most tours have none yet. */
  image: string;
};

export type PackageDay = {
  day: number;
  title: string;
  description: string;
  stops: PackageStop[];
};

export type TermDescription = { term: string; description: string };

export type TravelMitr = {
  name: string;
  photoUrl: string;
  languages: string;
  tripsLabel: string;
};

export type PackageDetail = {
  slug: string;
  name: string;
  title: string;
  destination: string;
  summary: string;
  /** Hero carousel images, always at least one. */
  gallery: string[];
  durationLabel: string;
  datesLabel: string;
  packageType: string;
  mealsLabel: string;
  fromCity: string;
  placesCovered: string[];
  priceFromInr: number | null;
  whyTour: TermDescription[];
  highlights: TermDescription[];
  days: PackageDay[];
  priceIncludes: string[];
  priceExcludes: string[];
  /** The guide who runs this tour; not every tour has one assigned. */
  travelMitr: TravelMitr | null;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function termList(v: unknown): TermDescription[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({ term: str(x.term), description: str(x.description) }))
    .filter((x) => x.term || x.description);
}

function dayList(v: unknown): PackageDay[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((raw, index) => ({
      // Numbered by position, not by the stored value: the tabs read
      // "Day 1..n" and must stay sequential however the data was edited.
      day: index + 1,
      title: str(raw.title),
      description: str(raw.description),
      stops: Array.isArray(raw.stops)
        ? raw.stops
            .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
            .map((s) => ({
              time: str(s.time),
              title: str(s.title),
              description: str(s.description),
              image: str(s.image),
            }))
        : [],
    }));
}

/** A Mitr needs a name to be worth showing; everything else is optional. */
function toMitr(raw: unknown): TravelMitr | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const name = str(m.name);
  if (!name) return null;
  return {
    name,
    photoUrl: str(m.photo_url),
    languages: str(m.languages),
    tripsLabel: str(m.trips_label),
  };
}

export function normalizePackageDetail(payload: unknown): PackageDetail | null {
  if (!payload || typeof payload !== "object") return null;
  const row = payload as Record<string, unknown>;
  const slug = str(row.slug);
  if (!slug) return null;

  const content =
    row.content && typeof row.content === "object"
      ? (row.content as Record<string, unknown>)
      : {};

  const card = str(row.card_image_url);
  const heroes = strList(row.hero_image_urls);
  // Ops uploads the card image first and the gallery later, so the card
  // image leads — but only once, if the gallery already starts with it.
  const gallery = card && heroes[0] !== card ? [card, ...heroes] : heroes;

  const name = str(row.display_name) || slug;

  return {
    slug,
    name,
    title: str(row.title) || name,
    destination: str(row.destination),
    summary: str(row.summary),
    gallery: gallery.filter(Boolean),
    durationLabel: str(row.duration_label),
    datesLabel: str(row.dates_label),
    packageType: str(row.package_type),
    mealsLabel: str(row.meals_label),
    fromCity: str(row.from_city),
    placesCovered: strList(row.places_covered),
    priceFromInr: typeof row.price_from_inr === "number" ? row.price_from_inr : null,
    whyTour: termList(content.why_tour_with_marzi),
    highlights: termList(content.highlights),
    days: dayList(content.days),
    priceIncludes: strList(content.price_includes),
    priceExcludes: strList(content.price_excludes),
    travelMitr: toMitr(row.travel_mitr),
  };
}
