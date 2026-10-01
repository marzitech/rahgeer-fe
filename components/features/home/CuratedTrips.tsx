"use client";

import { useEffect, useRef, useState } from "react";
// Aliased: the auto-scroll effect below binds a local `track` to the
// scroll container element, which would otherwise shadow this import.
import { track as trackEvent } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "./DestinationCard";
import { PACKAGES } from "./destinations.data";
import { TalkToMitrButton } from "./TalkToMitrButton";

const AUTO_SCROLL_MS = 3000;

/** The cards render twice, so scrolling one full set past the origin lands
 *  on pixels identical to the start. Rebasing the scroll position there
 *  (an instant, invisible jump) makes the rail loop circularly instead of
 *  snapping back to the first card. */
function rebaseIntoFirstSet(track: HTMLDivElement) {
  const cards = Array.from(track.children) as HTMLElement[];
  const half = Math.floor(cards.length / 2);
  if (half < 1) return;
  const loopWidth = cards[half].offsetLeft - cards[0].offsetLeft;
  if (loopWidth > 0 && track.scrollLeft >= loopWidth) {
    track.scrollLeft -= loopWidth;
  }
}

/** "Curated Trips, Ready to Explore" — the priced package trips, above the
 *  full explore grid. Horizontal snap scroll at every size, auto-advancing
 *  one card every 3s (pauses on touch/hover) in a seamless circular loop. */
export function CuratedTrips() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
      const cards = Array.from(track.children) as HTMLElement[];
      if (cards.length === 0) return;
      // Next snap target: the first card that starts past the current
      // scroll position (offsets measured relative to the first card).
      // The duplicated set ahead guarantees one exists; the onScroll
      // rebase keeps us from ever running off the end of it.
      const origin = cards[0].offsetLeft;
      const next = cards.find(
        (card) => card.offsetLeft - origin > track.scrollLeft + 4,
      );
      if (next) {
        track.scrollTo({ left: next.offsetLeft - origin, behavior: "smooth" });
      }
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  if (PACKAGES.length === 0) return null;

  return (
    <section id="curatedtrips" className="bg-white py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Trips"
          title="Curated Trips, Ready to Explore"
          subtitle="Ready-made journeys with everything handled — flights, stays, and pacing built for comfort."
        />

        <div
          ref={trackRef}
          onScroll={(e) => rebaseIntoFirstSet(e.currentTarget)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 sm:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {/* Two copies of the rail: the clones make the loop seamless and
              are hidden from assistive tech / tab order. */}
          {[...PACKAGES, ...PACKAGES].map((destination, i) => {
            const isClone = i >= PACKAGES.length;
            return (
              <div
                key={`${destination.name}-${isClone ? "clone" : "card"}`}
                aria-hidden={isClone || undefined}
                // Delegated on the wrapper, not inside DestinationCard: that card
                // is shared with the Destinations explore grid, and only the
                // priced package rail is a "package card" to the dashboard.
                onClick={() =>
                  trackEvent(EVENTS.PACKAGE_CARD_CLICK, {
                    package: destination.name,
                  })
                }
                className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[31.5%]"
              >
                <DestinationCard
                  destination={destination}
                  tabIndex={isClone ? -1 : undefined}
                />
              </div>
            );
          })}
        </div>

        {/* App design: "Have some doubts?" + Talk button under the cards. */}
        <div className="show-in-app mx-auto mt-8 max-w-md">
          <p className="font-display text-center text-lg font-bold">
            Have some doubts?
          </p>
          <div className="mt-3">
            <TalkToMitrButton
              form="app-curated-trips"
              className="bg-brand flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
