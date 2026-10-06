"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner } from "@/lib/content/home-content";
import { cn } from "@/lib/utils";

/**
 * "Travel Confidently" — the hero carousel at the top of the home page.
 *
 * Slides are edited in the admin dashboard. Auto-advance pauses on hover
 * and on focus, and stops entirely for a reader who has asked for reduced
 * motion: this audience is 50+, and a banner that slides away mid-sentence
 * is the fastest way to lose them.
 */

const ADVANCE_MS = 6000;

export function HeroCarousel({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;
  const banner = banners[index];

  return (
    <section className="bg-cream pt-6 pb-10 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-center text-3xl font-bold text-brand sm:text-4xl lg:text-5xl">
          Travel Confidently
        </h1>

        <div
          className="relative mt-6 sm:mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[21/9] sm:rounded-3xl">
            {banners.map((slide, i) => (
              <div
                key={slide.id}
                aria-hidden={i !== index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  i === index ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.alt || slide.headline || "Marzi Holidays"}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="object-cover"
                />
                {/* Left-weighted scrim: the headline sits over the photo and
                    has to stay readable whatever the photo is. */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
              </div>
            ))}

            {/* Marzi Holidays lockup, top-left, as in the design. */}
            <div className="absolute top-4 left-4 rounded-xl bg-white/95 px-3 py-2 sm:top-6 sm:left-6">
              <p className="font-display text-sm leading-none font-bold text-brand sm:text-base">
                marzi
              </p>
              <p className="font-display text-sm leading-tight font-bold text-brand sm:text-base">
                holidays
              </p>
              <p className="mt-0.5 text-[0.5rem] tracking-[0.18em] text-brand/70 uppercase">
                Travel Confidently
              </p>
            </div>

            {banner.badgeText ? (
              <span className="absolute top-1/2 right-4 flex size-20 -translate-y-1/2 items-center justify-center rounded-full bg-teal-600 p-2 text-center text-[0.55rem] leading-tight font-bold tracking-wide text-white uppercase sm:right-8 sm:size-24 sm:text-[0.6rem]">
                {banner.badgeText}
              </span>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
              <div className="max-w-xl">
                {banner.headline ? (
                  <p className="font-display text-xl leading-snug font-bold text-white sm:text-3xl lg:text-4xl">
                    {banner.headline}
                  </p>
                ) : null}
                {banner.ctaLabel && banner.ctaHref ? (
                  <Link
                    href={banner.ctaHref}
                    className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
                  >
                    {banner.ctaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            {banner.caption ? (
              <p className="absolute right-4 bottom-4 max-w-[60%] rounded-lg bg-white/90 px-3 py-1.5 text-[0.65rem] text-ink sm:right-8 sm:bottom-8 sm:text-xs">
                {banner.caption}
              </p>
            ) : null}
          </div>

          {count > 1 ? (
            <>
              <CarouselArrow side="left" onClick={() => go(index - 1)} />
              <CarouselArrow side="right" onClick={() => go(index + 1)} />
              <div className="mt-4 flex justify-center gap-2">
                {banners.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index ? "w-6 bg-brand" : "w-2 bg-brand/25 hover:bg-brand/40",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={cn(
        "absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-md transition-colors hover:bg-cream-dark sm:flex",
        side === "left" ? "-left-5" : "-right-5",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
