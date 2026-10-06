/**
 * Curated trips, as the website shows them.
 *
 * Source of truth is the packages endpoint; the shapes here are the card's
 * view of a package, so a change to the backend serializer touches one
 * mapper rather than every component that draws a trip.
 */

export type TripCard = {
  id: string;
  slug: string;
  name: string;
  title: string;
  imageUrl: string;
  durationLabel: string;
  datesLabel: string;
  packageType: string;
  placesCovered: string[];
  tags: string[];
  priceFromInr: number | null;
  href: string;
};

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function strList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function toTrip(raw: unknown, index: number): TripCard | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const slug = str(row.slug);
  // The whole card is a link to /packages/<slug>; without one it is dead.
  if (!slug) return null;

  return {
    id: str(row.id) || `trip-${index}`,
    slug,
    name: str(row.display_name) || slug,
    title: str(row.title),
    imageUrl: str(row.card_image_url),
    durationLabel: str(row.duration_label),
    datesLabel: str(row.dates_label),
    packageType: str(row.package_type),
    placesCovered: strList(row.places_covered),
    tags: strList(row.tags),
    priceFromInr: typeof row.price_from_inr === "number" ? row.price_from_inr : null,
    href: `/packages/${slug}`,
  };
}

/** Accepts the paginated envelope or a bare array. */
export function normalizeTrips(payload: unknown): TripCard[] {
  const rows = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown }).results)
      ? ((payload as { results: unknown[] }).results)
      : [];

  return rows.map(toTrip).filter((t): t is TripCard => t !== null);
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "₹1,25,000", or nothing at all when the trip is not priced yet. */
export function formatPriceInr(amount: number | null | undefined): string {
  if (!amount) return "";
  // Intl renders "₹1,25,000" with a non-breaking space in some runtimes.
  return INR.format(amount).replace(/\s/g, "");
}
