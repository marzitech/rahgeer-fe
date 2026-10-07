/**
 * Scroll maths for the horizontal card rails.
 *
 * Extracted so the edge cases are testable: the interesting part is not
 * the scrolling, it is not over-shooting the last card and not re-snapping
 * to the card you are already standing on.
 */

/**
 * Browsers report `scrollLeft` fractionally (hidpi, zoom, momentum), so a
 * rail sitting exactly on a card can read 298.6 instead of 300. Anything
 * within this many pixels counts as "already here".
 */
const EPSILON = 4;

/**
 * The offset to scroll to for one card forward (`1`) or back (`-1`).
 *
 * Returns the current end position when there is nowhere further to go,
 * so the caller can scroll unconditionally and the rail simply stops.
 */
export function nextSnapOffset(
  offsets: number[],
  current: number,
  direction: -1 | 1,
): number {
  if (offsets.length === 0) return 0;

  if (direction === 1) {
    const next = offsets.find((offset) => offset > current + EPSILON);
    return next ?? offsets[offsets.length - 1];
  }

  const previous = [...offsets].reverse().find((offset) => offset < current - EPSILON);
  return previous ?? 0;
}
