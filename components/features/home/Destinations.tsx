"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { DestinationCard } from "./DestinationCard";
import { GUIDES, TABS, type Tab } from "./destinations.data";

const AUTO_SCROLL_MS = 4000;

/** "Where would you like to go next?" — filter tabs + destination cards.
 *  Desktop: 3-col grid. Mobile: horizontal snap carousel auto-advancing
 *  every 4s (pauses on touch/hover; dots sync with manual swipes). */
export function Destinations() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visible = GUIDES.filter(
    (d) => activeTab === "All" || d.tags.includes(activeTab),
  );

  // Changing the filter changes the card list — restart from the first card.
  function selectTab(tab: Tab) {
    setActiveTab(tab);
    setActiveIndex(0);
    trackRef.current?.scrollTo({ left: 0 });
  }

  // Auto-advance only when the track actually scrolls (mobile layout).
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
      setActiveIndex((index) => {
        const next = (index + 1) % visible.length;
        track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
        return next;
      });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [isPaused, visible.length]);

  // Keep the dots honest when the user swipes manually.
  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Explore destinations"
          title="Where would you like to go next?"
          subtitle="Every holiday is planned around how you like to travel."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition",
                activeTab === tab
                  ? "bg-brand text-white shadow"
                  : "text-foreground/70 hover:border-brand/40 border border-black/10 bg-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((destination) => (
            <DestinationCard key={destination.name} destination={destination} />
          ))}
        </div>

        {/* Carousel dots — mobile only */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {visible.map((destination, index) => (
            <button
              key={destination.name}
              type="button"
              aria-label={`Go to ${destination.name}`}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                setActiveIndex(index);
                track.scrollTo({
                  left: index * track.clientWidth,
                  behavior: "smooth",
                });
              }}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeIndex ? "bg-brand w-6" : "w-2 bg-black/20",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
