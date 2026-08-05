"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const TABS = [
  "All",
  "International",
  "India",
  "Spiritual",
  "Mountains",
  "Beaches",
  "Wellness",
  "First International Trip",
] as const;

type Tab = (typeof TABS)[number];

const DESTINATIONS: {
  name: string;
  image: string;
  blurb: string;
  tags: Tab[];
}[] = [
  {
    name: "Europe",
    image: "/images/destinations/europe.jpg",
    blurb: "Grand cities, scenic rail journeys and unhurried sightseeing.",
    tags: ["International", "First International Trip"],
  },
  {
    name: "Kashmir",
    image: "/images/destinations/kashmir.jpg",
    blurb: "Houseboats, gardens and mountain air at a gentle pace.",
    tags: ["India", "Mountains"],
  },
  {
    name: "Japan",
    image: "/images/destinations/japan.jpg",
    blurb: "Culture, comfort and cherry blossoms made easy to explore.",
    tags: ["International"],
  },
  {
    name: "Kerala",
    image: "/images/destinations/kerala.jpg",
    blurb: "Backwaters, ayurveda and slow mornings by the water.",
    tags: ["India", "Wellness", "Beaches"],
  },
  {
    name: "Vietnam",
    image: "/images/destinations/vietnam.jpg",
    blurb: "Gentle adventures for your first trip beyond the familiar.",
    tags: ["International", "First International Trip"],
  },
  {
    name: "Rajasthan",
    image: "/images/destinations/rajasthan.jpg",
    blurb: "Palaces, heritage stays and royal comfort throughout.",
    tags: ["India", "Spiritual"],
  },
];

const AUTO_SCROLL_MS = 4000;

/** "Where would you like to go next?" — filter tabs + photo cards.
 *  Desktop: 3-col grid. Mobile: horizontal snap carousel auto-advancing
 *  every 4s (pauses on touch/hover; dots sync with manual swipes). */
export function Destinations() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visible = DESTINATIONS.filter(
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
          className="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((destination) => (
            <div
              key={destination.name}
              className="group relative h-[360px] w-[88%] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-auto sm:shrink md:h-[400px]"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 380px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 pt-20">
                <h3 className="font-display text-[26px] font-semibold text-white">
                  {destination.name}
                </h3>
                <p className="mt-1 text-sm leading-snug text-white/80">
                  {destination.blurb}
                </p>
                <a
                  href="#plan-your-trip"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white underline-offset-4 hover:underline"
                >
                  Plan This Trip <span aria-hidden>→</span>
                </a>
              </div>
            </div>
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
