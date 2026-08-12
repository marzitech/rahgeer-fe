"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { DestinationCard } from "./DestinationCard";
import { GUIDES, TABS, type Tab } from "./destinations.data";

const PER_SLIDE = 4; // 2 x 2 grid per slide

/** "Where would you like to go next?" — filter tabs + a horizontal slider,
 *  4 destinations (2x2) per slide on both mobile and desktop. */
export function Destinations() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const visible = GUIDES.filter(
    (d) => activeTab === "All" || d.tags.includes(activeTab),
  );

  const slides: (typeof visible)[] = [];
  for (let i = 0; i < visible.length; i += PER_SLIDE) {
    slides.push(visible.slice(i, i + PER_SLIDE));
  }

  // Reset to the first slide when the filter changes.
  function selectTab(tab: Tab) {
    setActiveTab(tab);
    setPage(0);
    trackRef.current?.scrollTo({ left: 0 });
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    setPage(clamped);
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setPage(Math.round(track.scrollLeft / track.clientWidth));
  }

  // selectTab already resets to slide 0 on filter change; clamp defensively
  // for the dots/arrows in case slide count shrank.
  const activePage = Math.min(page, Math.max(0, slides.length - 1));

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
                "rounded-full px-4 py-2 text-sm font-medium transition sm:px-5 sm:py-2.5",
                activeTab === tab
                  ? "bg-brand text-white shadow"
                  : "text-foreground/70 hover:border-brand/40 border border-black/10 bg-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="relative mt-10">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full shrink-0 snap-center">
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {slide.map((destination) => (
                    <DestinationCard
                      key={destination.name}
                      destination={destination}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Prev / next arrows (desktop) */}
          {slides.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() => goTo(activePage - 1)}
                disabled={activePage === 0}
                className="text-foreground absolute top-1/2 -left-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105 disabled:opacity-0 lg:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => goTo(activePage + 1)}
                disabled={activePage === slides.length - 1}
                className="text-foreground absolute top-1/2 -right-4 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105 disabled:opacity-0 lg:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        {/* Dots */}
        {slides.length > 1 ? (
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === activePage ? "bg-brand w-6" : "w-2 bg-black/20",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
