"use client";

/**
 * HomeTracking — home-page engagement analytics, rendered from the (server)
 * home page so the page itself ships no client JS for this.
 *
 * Emits:
 *  - Home_page_viewed on mount
 *  - Scroll_depth_home once per 25/50/75/100% depth bucket reached
 *  - Section_visible_home once per section per visit
 *  - Section_time_spent_home with dwell ms when a section leaves the viewport
 *
 * A section counts as "visible" when ≥50% of it is on screen OR it covers
 * ≥50% of the viewport — the second clause matters for sections taller than
 * the viewport (Hero on mobile), which can never reach a 0.5 ratio.
 *
 * Dwell times for sections still on screen at exit are flushed on pagehide;
 * the SDK's localStorage queue means anything not beaconed out in time is
 * delivered on the next visit instead of being lost.
 */

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";

// Explicit list — never observe arbitrary [id] elements; form fields and
// framework-injected nodes carry ids too.
const SECTION_IDS = [
  "hero",
  "travelmitr",
  "planningfor",
  "curatedtrips",
  "grouptrips",
  "destinations",
  "pressstrip",
  "howitworks",
  "comparison",
  "testimonials",
  "faq",
  "ctabanner",
  "footer",
];

const DEPTH_BUCKETS = [25, 50, 75, 100];
const MIN_DWELL_MS = 500; // ignore scroll-past flickers

export function HomeTracking() {
  useEffect(() => {
    track(EVENTS.HOME_PAGE_VIEWED);

    // --- Section visibility + dwell time ---
    const enteredAt = new Map<string, number>();
    const seen = new Set<string>();

    const flushDwell = (id: string) => {
      const t0 = enteredAt.get(id);
      if (t0 === undefined) return;
      enteredAt.delete(id);
      const ms = Date.now() - t0;
      if (ms >= MIN_DWELL_MS) {
        track(EVENTS.SECTION_TIME_SPENT_HOME, { section: id, ms });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const visible =
            entry.isIntersecting &&
            (entry.intersectionRatio >= 0.5 ||
              entry.intersectionRect.height >= window.innerHeight * 0.5);

          if (visible) {
            if (!enteredAt.has(id)) enteredAt.set(id, Date.now());
            if (!seen.has(id)) {
              seen.add(id);
              track(EVENTS.SECTION_VISIBLE_HOME, { section: id });
            }
          } else {
            flushDwell(id);
          }
        }
      },
      // Stepped thresholds so the callback re-fires as tall sections scroll
      // through, letting the viewport-coverage clause above kick in.
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    // --- Scroll depth buckets (each fires once) ---
    const firedBuckets = new Set<number>();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
        for (const bucket of DEPTH_BUCKETS) {
          if (pct >= bucket && !firedBuckets.has(bucket)) {
            firedBuckets.add(bucket);
            track(EVENTS.SCROLL_DEPTH_HOME, { depth: bucket });
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Queue dwell for sections still on screen when the page goes away.
    const onPageHide = () => {
      for (const id of [...enteredAt.keys()]) flushDwell(id);
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      onPageHide();
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
