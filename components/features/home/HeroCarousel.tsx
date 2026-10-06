"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { splitCaption, type HeroBanner } from "@/lib/content/home-content";
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
    <section className="bg-sand pt-24 pb-6 md:pt-28">
      <h1 className="font-display px-4 text-center text-[2rem] leading-tight font-extrabold text-brand sm:text-5xl">
        Travel Confidently
      </h1>

      <div
        className="mt-6 sm:mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Near-full-bleed, as the design has it: the banner is the page's
            widest element, held off the edges by a small gutter only. */}
        <div className="relative mx-auto max-w-[96rem] px-3 sm:px-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[21/9] sm:rounded-3xl">
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
                  sizes="100vw"
                  className="object-cover"
                />
                {/* A LIGHT wash, not a dark scrim: the headline is brand
                    maroon in this design, so the left of the photo has to
                    stay pale whatever photo ops uploads. */}
                <div className="absolute inset-0 bg-gradient-to-r from-sand/95 from-0% via-sand/80 via-35% to-transparent to-75% sm:via-sand/75 sm:via-32% sm:to-70%" />
              </div>
            ))}

            {/* Thin inset frame, as drawn in the design. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-white/50 sm:inset-5 sm:rounded-2xl"
            />

            {/* Marzi Holidays lockup — a soft tan shape bleeding out of the
                top-left corner rather than a floating card. */}
            <div className="absolute top-0 left-0 rounded-br-[2rem] bg-sand/95 py-3 pr-7 pl-4 sm:py-4 sm:pr-10 sm:pl-6">
              <p className="font-display text-base leading-none font-extrabold text-brand sm:text-xl">
                marzi
              </p>
              <p className="font-display text-base leading-tight font-extrabold text-brand sm:text-xl">
                holidays
              </p>
              <p className="mt-1 text-[0.45rem] tracking-[0.2em] text-brand/70 uppercase sm:text-[0.55rem]">
                Travel Confidently
              </p>
            </div>

            {banner.badgeText ? (
              <span className="absolute top-1/2 right-4 flex size-[4.5rem] -translate-y-1/2 items-center justify-center rounded-full bg-sage p-2 text-center text-[0.5rem] leading-tight font-semibold text-white sm:right-10 sm:size-24 sm:text-[0.7rem]">
                {banner.badgeText}
              </span>
            ) : null}

            <div className="absolute inset-y-0 left-0 flex max-w-[78%] flex-col justify-center p-5 sm:max-w-[48%] sm:p-10 lg:p-14">
              {banner.headline ? (
                <p className="font-display text-xl leading-[1.15] font-extrabold text-brand sm:text-3xl lg:text-[2.6rem]">
                  {banner.headline}
                </p>
              ) : null}
              {banner.ctaLabel && banner.ctaHref ? (
                <Link
                  href={banner.ctaHref}
                  className="mt-5 inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
                >
                  {banner.ctaLabel}
                </Link>
              ) : null}
            </div>

            {banner.caption ? (
              <p className="absolute right-4 bottom-4 max-w-[70%] rounded-xl bg-white/95 px-4 py-2 text-[0.7rem] text-ink shadow-sm sm:right-10 sm:bottom-8 sm:text-sm">
                {splitCaption(banner.caption).map((run, i) => (
                  <span key={i} className={run.emphasis ? "font-semibold text-brand" : undefined}>
                    {run.text}
                  </span>
                ))}
              </p>
            ) : null}
          </div>

          {count > 1 ? (
            /* Controls sit below the banner — on the sand, not over the
               photo, where they can never fight the artwork for contrast. */
            <div className="mt-5 flex items-center justify-between">
              <CarouselArrow side="left" onClick={() => go(index - 1)} />
              <div className="flex gap-2">
                {banners.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      i === index ? "bg-brand" : "bg-brand/20 hover:bg-brand/40",
                    )}
                  />
                ))}
              </div>
              <CarouselArrow side="right" onClick={() => go(index + 1)} />
            </div>
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
      className="flex size-9 items-center justify-center rounded-full bg-white text-ink/70 shadow-sm ring-1 ring-black/5 transition-colors hover:bg-cream-dark sm:size-10"
    >
      <Icon className="size-4 sm:size-5" />
    </button>
  );
}
