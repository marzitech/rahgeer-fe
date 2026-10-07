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
 * Two layouts, one markup. On a desktop the copy sits over the left of
 * the photo; on a phone it stacks above it, because a 390px column has
 * no room for a headline and a photograph in the same place — overlaid,
 * the type lands on whatever the photo happens to be doing there.
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
          {/* Desktop layers the slides and cross-fades between them. A
              phone cannot: the stacked layout has no fixed height, so the
              inactive ones are simply hidden. They stay mounted either
              way, so advancing never flashes an empty frame. */}
          <div className="sm:relative sm:aspect-[21/9] sm:overflow-hidden sm:rounded-3xl">
            {banners.map((slide, i) => (
              <div
                key={slide.id}
                aria-hidden={i !== index}
                className={cn(
                  "sm:absolute sm:inset-0 sm:transition-opacity sm:duration-700",
                  i === index
                    ? "sm:opacity-100"
                    : "hidden sm:block sm:pointer-events-none sm:opacity-0",
                )}
              >
                <Slide slide={slide} priority={i === 0} />
              </div>
            ))}
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

function Slide({ slide, priority }: { slide: HeroBanner; priority: boolean }) {
  return (
    <div className="flex flex-col-reverse overflow-hidden rounded-2xl bg-white/70 ring-1 ring-brand/10 sm:block sm:rounded-none sm:bg-transparent sm:ring-0">
      {/* Photo. In flow under the copy on a phone; the whole frame on a
          desktop, with the copy laid over its left third. */}
      <div className="relative m-3 mt-0 aspect-[5/4] overflow-hidden rounded-xl sm:absolute sm:inset-0 sm:m-0 sm:aspect-auto sm:rounded-none">
        <Image
          src={slide.imageUrl}
          alt={slide.alt || slide.headline || "Marzi Holidays"}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
        {/* A LIGHT wash, not a dark scrim: the headline is brand maroon on
            desktop, so the left of the photo has to stay pale whatever
            photo ops uploads. Not needed on mobile — nothing sits on it. */}
        <div className="hidden sm:block sm:absolute sm:inset-0 sm:bg-gradient-to-r sm:from-sand/95 sm:from-0% sm:via-sand/75 sm:via-32% sm:to-transparent sm:to-70%" />

        {slide.badgeText ? (
          <span className="absolute top-3 right-3 flex size-[4.25rem] items-center justify-center rounded-full bg-sage p-2 text-center text-[0.5rem] leading-tight font-semibold text-white sm:top-1/2 sm:right-10 sm:size-24 sm:-translate-y-1/2 sm:text-[0.7rem]">
            {slide.badgeText}
          </span>
        ) : null}

        {slide.caption ? (
          <p className="absolute right-3 bottom-3 left-3 rounded-lg bg-white/92 px-3 py-2 text-center text-[0.65rem] text-ink shadow-sm sm:left-auto sm:max-w-[70%] sm:rounded-xl sm:px-4 sm:bottom-8 sm:right-10 sm:text-left sm:text-sm">
            {splitCaption(slide.caption).map((run, i) => (
              <span key={i} className={run.emphasis ? "font-semibold text-brand" : undefined}>
                {run.text}
              </span>
            ))}
          </p>
        ) : null}

        {/* Desktop-only lockup: a soft tan shape bleeding out of the
            top-left corner of the photo. */}
        <div className="hidden rounded-br-[2rem] bg-sand/95 py-4 pr-10 pl-6 sm:absolute sm:top-0 sm:left-0 sm:block">
          <Lockup />
        </div>
      </div>

      {/* Copy. */}
      <div className="px-5 pt-5 pb-4 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:max-w-[48%] sm:flex-col sm:justify-center sm:p-10 lg:p-14">
        <div className="sm:hidden">
          <Lockup />
        </div>

        {slide.headline ? (
          <p className="font-display mt-4 text-[1.4rem] leading-[1.2] font-extrabold text-brand sm:mt-0 sm:text-3xl lg:text-[2.6rem]">
            {slide.headline}
          </p>
        ) : null}

        {slide.ctaLabel && slide.ctaHref ? (
          <Link
            href={slide.ctaHref}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep sm:mt-5 sm:px-6 sm:py-3"
          >
            {slide.ctaLabel}
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Lockup() {
  return (
    <>
      <p className="font-display text-lg leading-none font-extrabold text-brand sm:text-xl">
        marzi
      </p>
      <p className="font-display text-lg leading-tight font-extrabold text-brand sm:text-xl">
        holidays
      </p>
      <p className="mt-1 text-[0.5rem] tracking-[0.2em] text-brand/70 uppercase sm:text-[0.55rem]">
        Travel Confidently
      </p>
    </>
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
