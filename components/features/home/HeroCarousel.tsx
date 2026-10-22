"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import {
  hasOverlaidCopy,
  splitCaption,
  type HeroBanner,
} from "@/lib/content/home-content";
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
    // Top padding = the fixed header's exact height (h-16 / lg:h-20), so
    // the banner starts flush beneath it — the artwork's own inset frame
    // provides the breathing room.
    <section className="bg-sand pt-16 pb-6 lg:pt-20">
      {/* Visually removed (Oct 2026) but kept for screen readers: the
          sections below are h2s, and this is the page's only h1. */}
      <h1 className="sr-only">Travel Confidently</h1>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Full-bleed: the banner runs edge to edge. The phone keeps its
            small gutter — there the slide is a card, not a photo frame. */}
        <div className="relative w-full px-3 sm:px-0">
          {/* Desktop layers the slides and cross-fades between them. A
              phone cannot: the stacked layout has no fixed height, so the
              inactive ones are simply hidden. They stay mounted either
              way, so advancing never flashes an empty frame.

              The frame is marketing's standard hero canvas (1920×1012,
              shared with the marzi-web hero film). It must match what
              they export: any other ratio makes object-cover crop the
              artwork — a 21/9 frame took the top of the subject's head
              off the Oct 2026 banner. */}
          <div className="sm:relative sm:aspect-[1920/1012] sm:overflow-hidden">
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

            {/* The hero's one call to action, pinned bottom-center over
                the banner — on a desktop the banner fills the viewport,
                so a CTA below it would sit under the fold, defeating a
                button whose whole job is to pull people down the page.
                Desktop only: on a phone the trips rail is already one
                flick away, and a button under the card just pushed it
                further down. */}
            <div className="pointer-events-none hidden sm:absolute sm:inset-x-0 sm:bottom-7 sm:z-10 sm:flex sm:justify-center">
              <ExploreHolidaysCta />
            </div>
          </div>


          {count > 1 ? (
            /* Controls sit below the banner — on the sand, not over the
               photo, where they can never fight the artwork for contrast. */
            <div className="mt-5 flex items-center justify-between sm:px-4">
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

/** "Explore Our Upcoming Holidays ↓" — scrolls to the trips rail. A plain
 *  anchor: HashScroll smooth-scrolls same-page hashes (respecting reduced
 *  motion) and scroll-padding-top clears the fixed header. */
function ExploreHolidaysCta() {
  return (
    <a
      href="#trips"
      onClick={() => track(EVENTS.TRAVEL_CTA_CLICKED, { cta: "explore-holidays", section: "hero" })}
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-deep sm:text-base"
    >
      Explore Our Upcoming Holidays
      <ChevronDown aria-hidden className="size-4 sm:size-5" />
    </a>
  );
}

function Slide({ slide, priority }: { slide: HeroBanner; priority: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse overflow-hidden rounded-2xl sm:block sm:rounded-none sm:bg-transparent sm:ring-0",
        // The white card chrome exists to seat the copy block under the
        // photo. Finished artwork has no copy block — there the image IS
        // the card, edge to edge, and a white frame around it is just a
        // gap in the design.
        hasOverlaidCopy(slide) && "bg-white/70 ring-1 ring-brand/10",
      )}
    >
      {/* Photo. In flow under the copy on a phone; the whole frame on a
          desktop, with the copy laid over its left third. The phone's 5:4
          crop is only safe on a plain photo — finished artwork (copy
          baked in) keeps its full canvas, or the crop cuts its text. */}
      <div
        className={cn(
          "relative overflow-hidden sm:absolute sm:inset-0 sm:m-0 sm:aspect-auto sm:rounded-none",
          // Inset with rounded corners inside the copy card; full-bleed
          // when the artwork is the card (the outer rounded-2xl clips it).
          hasOverlaidCopy(slide)
            ? "m-3 mt-0 aspect-[5/4] rounded-xl"
            : "aspect-[1920/1012]",
        )}
      >
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
            photo ops uploads. Not needed on mobile — nothing sits on it —
            nor on a slide whose copy is baked into the artwork (empty
            headline/CTA): there it only fades the image's own text. */}
        {hasOverlaidCopy(slide) ? (
          <div className="hidden sm:block sm:absolute sm:inset-0 sm:bg-gradient-to-r sm:from-sand/95 sm:from-0% sm:via-sand/75 sm:via-32% sm:to-transparent sm:to-70%" />
        ) : null}

        {slide.badgeText ? (
          <span
            className={cn(
              "absolute right-3 flex size-[4.25rem] items-center justify-center rounded-full bg-teal p-2 text-center text-[0.5rem] leading-tight font-semibold text-white sm:right-10 sm:bottom-10 sm:size-24 sm:text-[0.7rem]",
              // Bottom-right on every size now. On mobile the caption is a
              // full-width pill pinned to the bottom, so sit above it when
              // there is one rather than landing on top of it.
              slide.caption ? "bottom-20" : "bottom-3",
            )}
          >
            {slide.badgeText}
          </span>
        ) : null}

        {slide.caption ? (
          <p className="font-label bg-sand-deep absolute right-3 bottom-3 left-3 rounded-2xl px-4 py-2.5 text-center text-[0.7rem] font-bold text-[#0d0d0d] sm:right-10 sm:bottom-8 sm:left-auto sm:max-w-[70%] sm:rounded-[27px] sm:text-left sm:text-[1.125rem]">
            {splitCaption(slide.caption).map((run, i) => (
              <span key={i} className={run.emphasis ? "text-brand-deep" : undefined}>
                {run.text}
              </span>
            ))}
          </p>
        ) : null}

      </div>

      {/* Copy. Skipped entirely on finished artwork — rendered empty, its
          padding shows as a dead white strip above the photo on phones. */}
      {hasOverlaidCopy(slide) ? (
      <div className="px-5 pt-5 pb-4 sm:absolute sm:inset-y-0 sm:left-0 sm:flex sm:max-w-[48%] sm:flex-col sm:justify-center sm:p-10 lg:p-14">
        {slide.headline ? (
          <p className="font-display text-brand-deep text-[1.4rem] leading-[1.15] font-extrabold sm:text-3xl lg:text-[2.66rem]">
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
      ) : null}
    </div>
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
