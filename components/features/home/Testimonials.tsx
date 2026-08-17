"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const AUTO_SCROLL_MS = 4000;

type Testimonial = {
  name: string;
  detail: string;
  quote: string;
  avatar?: string; // brand persona art; initials circle when absent
  tripPhoto?: string;
  tripPhotoAlt?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Manjunath",
    detail: "Traveller · Age 65",
    quote:
      "Every detail perfect, every moment memorable, exceeded expectations completely.",
  },
  {
    name: "Jayaram N",
    detail: "Traveller",
    quote:
      "My wife and I enjoyed the trip to Somnathpura, and Talakadu was very enjoyable.",
  },
  {
    name: "Shajee Kozhukkunnon",
    detail: "Traveller",
    quote:
      "Great selfless & positive group of Marzi. They are arranging trips, which makes it more enjoyable.",
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

/** "Trusted by travellers. Recommended by families." — review cards.
 *  Desktop (sm+): 2/3-column masonry. Mobile: horizontal snap carousel
 *  auto-advancing every 4s (pauses on touch/hover; dots sync). */
export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance only when the track actually scrolls (mobile layout).
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth) return;
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
    <section className="bg-[#faf8f5] py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Reviews"
          title="Trusted by travellers. Recommended by families."
        />

        <div
          ref={trackRef}
          onScroll={handleScroll}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-12 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex w-[88%] shrink-0 snap-center flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm sm:h-full sm:w-auto sm:shrink"
            >
              <Stars />
              {testimonial.tripPhoto ? (
                <div className="relative mt-4 h-44 w-full overflow-hidden rounded-xl">
                  <Image
                    src={testimonial.tripPhoto}
                    alt={testimonial.tripPhotoAlt ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <blockquote className="text-foreground/80 mt-4 text-[15px] leading-relaxed">
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
      </div>
    </section>
  );
}
