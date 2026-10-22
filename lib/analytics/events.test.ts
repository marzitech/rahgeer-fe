/**
 * events.test.ts — the funnel names have to be matchable.
 *
 * ── Why this file exists ────────────────────────────────────────────────────
 *
 * GANGADHAR's funnel stages are matched on event-name SUFFIXES
 * (service/src/analytics/journey.ts). A name that does not follow the
 * convention is not rejected anywhere — it is accepted, stored, and silently
 * absent from every funnel. The ten names this site started with are all in
 * that state: `Home_page_viewed_travel_web` is capitalised, bakes the surface
 * into the name, and matches nothing.
 *
 * So the new names are asserted against the taxonomy here, at the only moment
 * it is cheap to get right. The legacy ten are listed explicitly as known
 * exceptions rather than excluded by a pattern, so retiring one is a visible
 * edit to this file and adding an eleventh is impossible by accident.
 */

import { describe, expect, it } from "vitest";
import { EVENTS } from "./events";

/**
 * The names that predate the taxonomy.
 *
 * Renaming them is a separate change with its own protocol — dual-emit for one
 * cycle, migrate journey.ts's matcher, then retire — because changing one now
 * changes what every existing report matches.
 */
const LEGACY = new Set([
  "Home_page_viewed_travel_web",
  "Scroll_depth_home_travel_web",
  "Section_visible_home_travel_web",
  "Section_time_spent_home_travel_web",
  "Book_self_cta_home_travel_web",
  "Book_parents_cta_home_travel_web",
  "Package_card_click_home_travel_web",
  "Faq_dropdown_click_home_travel_web",
  "Call_click_footer_travel_web",
  "Callback_request_footer_travel_web",
]);

const names = Object.values(EVENTS) as string[];
const current = names.filter((n) => !LEGACY.has(n));

describe("the event registry", () => {
  it("has no duplicates", () => {
    // Two keys pointing at one name means one of them silently never appears
    // in a report of its own.
    expect(new Set(names).size).toBe(names.length);
  });

  it("still contains every legacy name, so nothing was renamed by accident", () => {
    for (const legacy of LEGACY) expect(names).toContain(legacy);
  });

  it("names the marketing CTA click", () => {
    // The hero banner's "Explore Our Upcoming Holidays" button is the
    // first emitter; WHICH button is a property (cta/section), never the
    // name, so the next marketing CTA reuses this event.
    expect(current).toContain("travel_cta_clicked");
  });

  it("covers the whole enquiry funnel", () => {
    // The single most important conversion on this site, which emitted nothing
    // at all before. Each step is separate on purpose: "rejected" is our form
    // refusing them and "failed" is the backend, and one event for both would
    // hide which.
    for (const step of [
      "started",
      "submitted",
      "succeeded",
      "failed",
      "rejected",
    ]) {
      expect(current).toContain(`travel_enquiry_${step}`);
    }
  });
});

describe("every new name follows the estate taxonomy", () => {
  it("is lowercase snake_case", () => {
    for (const name of current) {
      expect(name, name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it("starts with a reserved area", () => {
    // `travel` is already reserved in docs/EVENT_TAXONOMY.md.
    for (const name of current) {
      expect(name.startsWith("travel_"), name).toBe(true);
    }
  });

  it("is <area>_<object>_<action> — three parts at least", () => {
    for (const name of current) {
      expect(name.split("_").length, name).toBeGreaterThanOrEqual(3);
    }
  });

  it("ends in a past-tense action", () => {
    // The matcher reads the SUFFIX, so this is the half that decides whether
    // the event is visible in a funnel at all.
    for (const name of current) {
      expect(name, name).toMatch(/(ed|failed)$/);
    }
  });

  it("bakes no variant into the name", () => {
    // "Variants are properties, never names" — one travel_enquiry_submitted
    // carrying form:"plan-parents", not a name per form. These are the words
    // that would show somebody had done it anyway.
    for (const name of current) {
      for (const variant of [
        "home",
        "footer",
        "hero",
        "web",
        "mobile",
        "parents",
        "self",
        "desktop",
      ]) {
        expect(
          name.split("_"),
          `${name} names a variant: ${variant}`,
        ).not.toContain(variant);
      }
    }
  });
});
