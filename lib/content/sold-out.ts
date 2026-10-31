/**
 * Packages the desk has closed for bookings.
 *
 * Hardcoded for now: the backend has no "sold out" field yet, so until it
 * does this list is the one place to flip a tour. Keyed by package slug,
 * which is the same on the home rail and the package page.
 */
export const SOLD_OUT_SLUGS: readonly string[] = ["vietnam"];

const SOLD_OUT = new Set(SOLD_OUT_SLUGS);

/** Whether the package behind `slug` should carry the "Sold out" tag. */
export function isSoldOut(slug: string | null | undefined): boolean {
  if (typeof slug !== "string") return false;
  return SOLD_OUT.has(slug.trim().toLowerCase());
}

/** The tag's copy, shared so every surface says the same thing. */
export const SOLD_OUT_LABEL = "Sold out";
