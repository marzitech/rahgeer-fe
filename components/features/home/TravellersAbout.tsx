"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Our Travellers, About Us" — real travellers, in their own words.
 *
 * Three portraits at a time on desktop, one on mobile. The centre card
 * carries the quote; the ones beside it are there to show these are
 * people, not avatars, which is the whole argument the section makes.
 */

type Traveller = {
  name: string;
  detail: string;
  quote: string;
  photo: string;
};

const TRAVELLERS: Traveller[] = [
  {
    name: "Ramesh",
    detail: "54, Retired Banker",
    quote:
      "After retirement, my circle had become very small. Marzi gave me a reason to step out, meet people and feel excited about my week again.",
    photo: "/images/home/reviewer-vikram.jpg",
  },
  {
    name: "Meena",
    detail: "58, Retired Teacher",
    quote:
      "I travelled alone for the first time at 58. Never once did I feel out of place — someone was always looking out for me.",
    photo: "/images/home/reviewer-anita.jpg",
  },
  {
    name: "Vikas",
    detail: "52, Retired Officer",
    quote:
      "Everything was handled, right from the cab at my door to the return. All I had to do was enjoy the trip.",
    photo: "/images/home/reviewer-priya.jpg",
  },
];

export function TravellersAbout() {
  const [active, setActive] = useState(1);
  const count = TRAVELLERS.length;
  const go = (next: number) => setActive(((next % count) + count) % count);

  return (
    <section className="bg-sand pt-12 sm:pt-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-center text-[1.75rem] font-extrabold text-brand sm:text-4xl">
          Our Travellers, About Us
        </h2>
      </div>

      {/* The maroon band sits behind the lower half of the cards, as in the
          design — hence the overlap rather than a plain background. */}
      <div className="relative mt-8">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-brand" aria-hidden />

        <div className="relative mx-auto max-w-5xl px-4">
          <ul className="grid gap-4 sm:grid-cols-3">
            {TRAVELLERS.map((traveller, index) => (
              <li
                key={traveller.name}
                className={cn(
                  index === active ? "block" : "hidden sm:block",
                )}
              >
                <TravellerCard traveller={traveller} highlighted={index === active} />
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-4 py-6">
            <CarouselArrow side="left" onClick={() => go(active - 1)} />
            <div className="flex gap-2">
              {TRAVELLERS.map((traveller, index) => (
                <button
                  key={traveller.name}
                  type="button"
                  onClick={() => go(index)}
                  aria-label={`Show ${traveller.name}'s story`}
                  aria-current={index === active}
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    index === active ? "bg-white" : "bg-white/40 hover:bg-white/60",
                  )}
                />
              ))}
            </div>
            <CarouselArrow side="right" onClick={() => go(active + 1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TravellerCard({
  traveller,
  highlighted,
}: {
  traveller: Traveller;
  highlighted: boolean;
}) {
  return (
    <article className="relative aspect-[3/4] overflow-hidden rounded-2xl">
      <Image
        src={traveller.photo}
        alt={traveller.name}
        fill
        sizes="(max-width: 640px) 100vw, 320px"
        className={cn("object-cover", !highlighted && "grayscale")}
      />
      <div
        className={cn(
          "absolute inset-0",
          highlighted
            ? "bg-gradient-to-t from-brand/95 via-brand/70 to-brand/20"
            : "bg-gradient-to-t from-black/70 to-transparent",
        )}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white">
        {highlighted ? (
          <>
            <Quote className="mx-auto mb-2 size-4 opacity-70" aria-hidden />
            <p className="text-xs leading-relaxed">{traveller.quote}</p>
          </>
        ) : null}
        <p className="mt-3 text-sm font-semibold">{traveller.name}</p>
        <p className="text-[0.65rem] opacity-80">{traveller.detail}</p>
      </div>
    </article>
  );
}

function CarouselArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous traveller" : "Next traveller"}
      className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
    >
      <Icon className="size-4" />
    </button>
  );
}
