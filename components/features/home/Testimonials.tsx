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
    name: "Kavita Rao",
    detail: "Traveler · Travelled to Sri Lanka",
    quote:
      "The trip was well organised, negotiated and full of warm people. I could simply relax and enjoy the experience.",
    avatar: "/images/home/reviewer-anita.jpg",
    tripPhoto: "/images/home/review-trip-1.jpg",
    tripPhotoAlt: "Group of Marzi travellers in Sri Lanka",
  },
  {
    name: "Amita Sharma",
    detail: "Traveler · Travelled to Kashmir",
    quote:
      "The trip was well paced, organised and full of warm people. I would gladly travel with Marzi again.",
  },
  {
    name: "Rajeev Sethi",
    detail: "Traveler · Travelled to Vietnam",
    quote:
      "The team handled the planning so well that I could focus entirely on enjoying the journey with my wife.",
    avatar: "/images/home/reviewer-vikram.jpg",
    tripPhoto: "/images/home/review-trip-2.jpg",
    tripPhotoAlt: "Marzi travellers exploring Vietnam",
  },
  {
    name: "Meera Kapoor",
    detail: "Booked for parents",
    quote:
      "Thoughtfully planned and always keen to help. Booked my parents' trip and they came back smiling.",
    avatar: "/images/home/reviewer-priya.jpg",
  },
  {
    name: "Suresh Iyer",
    detail: "Traveler · First international trip",
    quote:
      "Our Travel Mitr called before every leg of the journey. For our first trip abroad, that reassurance meant everything.",
    tripPhoto: "/images/home/review-trip-3.jpg",
    tripPhotoAlt: "A Marzi tour group with their guide",
  },
  {
    name: "Lakshmi Nair",
    detail: "Traveler · Travelled to Kerala",
    quote:
      "Every stay was comfortable and every day unhurried. It felt like the holiday was designed just for us.",
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
          className="mt-12 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto sm:block sm:columns-2 sm:gap-6 sm:overflow-visible lg:columns-3 [&::-webkit-scrollbar]:hidden sm:[&>*]:mb-6"
        >
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="w-[88%] shrink-0 snap-center break-inside-avoid rounded-2xl border border-black/8 bg-white p-6 shadow-sm sm:w-auto sm:shrink"
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
              <figcaption className="mt-5 flex items-center gap-3">
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
