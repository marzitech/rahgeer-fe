import { describe, expect, it } from "vitest";
import { nextSnapOffset } from "./rail";

// Three cards, 300px apart.
const OFFSETS = [0, 300, 600];

describe("nextSnapOffset", () => {
  it("advances one card at a time", () => {
    expect(nextSnapOffset(OFFSETS, 0, 1)).toBe(300);
    expect(nextSnapOffset(OFFSETS, 300, 1)).toBe(600);
  });

  it("goes back one card at a time", () => {
    expect(nextSnapOffset(OFFSETS, 600, -1)).toBe(300);
    expect(nextSnapOffset(OFFSETS, 300, -1)).toBe(0);
  });

  it("stays put at either end rather than jumping", () => {
    expect(nextSnapOffset(OFFSETS, 600, 1)).toBe(600);
    expect(nextSnapOffset(OFFSETS, 0, -1)).toBe(0);
  });

  it("lands on the next card from a position mid-way between two", () => {
    expect(nextSnapOffset(OFFSETS, 150, 1)).toBe(300);
    expect(nextSnapOffset(OFFSETS, 150, -1)).toBe(0);
  });

  it("is not fooled by a fractional scroll position", () => {
    // Browsers report scrollLeft fractionally on zoomed or hidpi displays.
    // Sitting "on" card 2 at 298.6 must still advance to card 3, not
    // re-snap to the card we are already on.
    expect(nextSnapOffset(OFFSETS, 298.6, 1)).toBe(600);
    expect(nextSnapOffset(OFFSETS, 301.4, -1)).toBe(0);
  });

  it("copes with an empty or single-card rail", () => {
    expect(nextSnapOffset([], 0, 1)).toBe(0);
    expect(nextSnapOffset([0], 0, 1)).toBe(0);
    expect(nextSnapOffset([0], 0, -1)).toBe(0);
  });
});
