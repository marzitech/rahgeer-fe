/**
 * The icons the dashboard can put on a row, and the files they render as.
 *
 * Rows arrive from the backend carrying an icon *key*, never an icon: the
 * dashboard cannot send a React component. The keys are the contract with
 * the dashboard's picker (admin-v2 `src/lib/travel-icons.ts`) — both lists
 * must carry the same ones, because a key the picker offers and this map
 * lacks renders as the fallback glyph, which looks like a bug to whoever
 * chose it.
 *
 * Adding one: export the SVG from Figma into both
 * `rahgeer-fe/public/images/figma/` and
 * `admin-v2/public/images/travel-icons/`, then add it here, to the
 * dashboard's registry, and to the key list in the tests beside each.
 */

const ICONS: Record<string, string> = {
  guide: "/images/figma/icon-guide.svg",
  doctor: "/images/figma/icon-doctor.svg",
  meals: "/images/figma/icon-meals.svg",
  solo: "/images/figma/icon-solo.svg",
  door: "/images/figma/icon-door.svg",
  clock: "/images/figma/icon-clock.svg",
  hotel: "/images/figma/icon-hotel.svg",
  sightseeing: "/images/figma/icon-sightseeing.svg",
  coach: "/images/figma/icon-coach.svg",
  water: "/images/figma/icon-water.svg",
  flight: "/images/figma/icon-flight.svg",
  beverages: "/images/figma/icon-beverages.svg",
  laundry: "/images/figma/icon-laundry.svg",
  planning: "/images/figma/icon-planning.svg",
};

/** Every key the site can render, for tests and for iterating. */
export const ICON_KEYS = Object.keys(ICONS);

/**
 * The SVG for a stored key.
 *
 * An unknown or empty key gets the guide glyph rather than nothing: a
 * missing icon leaves a hole in the row, which reads as broken, while a
 * neutral stand-in reads as a choice.
 */
export function iconSrc(key: string): string {
  return ICONS[key] ?? ICONS.guide;
}
