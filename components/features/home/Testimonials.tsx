"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SparkleChip } from "./SparkleChip";

const AUTO_SCROLL_MS = 4000;

type Testimonial = {
  name: string;
  detail: string;
  quote: string;
  avatar?: string; // brand persona art; initials circle when absent
  tripPhoto: string;
  tripPhotoAlt?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Manjunath",
    detail: "Traveller · Age 65",
    quote:
      "Every detail perfect, every moment memorable, exceeded expectations completely.",
    tripPhoto: "/images/home/review-trip-1.jpg",
  },
  {
    name: "Jayaram N",
    detail: "Traveller",
    quote:
      "My wife and I enjoyed the trip to Somnathpura, and Talakadu was very enjoyable.",
    tripPhoto: "/images/home/review-trip-2.jpg",
  },
  {
    name: "Shajee Kozhukkunnon",
    detail: "Traveller",
    quote:
      "Great selfless & positive group of Marzi. They are arranging trips, which makes it more enjoyable.",
    tripPhoto: "/images/home/review-trip-3.jpg",
  },
];

function Stars() {
  return (
    <div className="text-gold flex gap-0.5" aria-label="5 star rating">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

function Avatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.avatar) {
    return (
      <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
        <Image
          src={testimonial.avatar}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>
    );
  }
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <div className="bg-brand/10 text-brand flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold">
      {initials}
    </div>
  );
}

/** "Trusted by travellers. Recommended by families." — redesigned review
 *  carousel: trip photo + stars + quote + traveller cards in a horizontal
 *  snap rail on every breakpoint (cards cut at the edges per the design),
 *  auto-advancing on mobile where one card fills the track. */
export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance only when one card fills the track (mobile layout).
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
      if (track.clientWidth > 700) return; // desktop rail: let users browse
      setActiveIndex((index) => {
        const next = (index + 1) % TESTIMONIALS.length;
        track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
        return next;
      });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Keep the dots honest when the user swipes manually.
  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  }

  return (
    <section className="overflow-hidden bg-white py-16 md:py-20">
      <div className="text-center">
        <SparkleChip label="Reviews" />
        <h2 className="font-display mt-4 px-4 text-[28px] font-bold text-balance md:text-4xl">
          Trusted by travellers. Recommended by families.
        </h2>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto px-4 pb-2 md:px-[max(2.5rem,calc((100vw-1192px)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex w-[88%] shrink-0 snap-center flex-col gap-4 rounded-[24px] border border-[#eadfce] bg-white p-4 shadow-sm sm:w-[560px] sm:snap-start sm:flex-row"
          >
            <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:w-[45%]">
              <Image
                src={testimonial.tripPhoto}
                alt={testimonial.tripPhotoAlt ?? ""}
                fill
                sizes="(max-width: 640px) 88vw, 252px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col px-1 py-1.5 sm:py-2">
              <Stars />
              <blockquote className="text-foreground/80 mt-3 text-[15px] leading-relaxed">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-5">
                <Avatar testimonial={testimonial} />
                <div>
                  <p className="text-sm font-bold">{testimonial.name}</p>
                  <p className="text-foreground/50 text-xs">
                    {testimonial.detail}
                  </p>
                </div>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* Carousel dots — mobile only */}
      <div className="mt-6 flex justify-center gap-2 sm:hidden">
        {TESTIMONIALS.map((testimonial, index) => (
          <button
            key={testimonial.name}
            type="button"
            aria-label={`Go to review by ${testimonial.name}`}
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
    </section>
  );
}
