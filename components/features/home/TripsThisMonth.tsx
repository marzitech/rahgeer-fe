"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { nextSnapOffset } from "@/lib/content/rail";
import { formatPriceInr, type TripCard } from "@/lib/content/trips";
import { cn } from "@/lib/utils";

/**
 * "Trips you can join this month" — the curated group tours.
 *
 * A horizontal snap rail: three cards in view on a desktop, one and a
 * peek on a phone. The peek is the affordance — it is what tells someone
 * there is more to the right without a row of dots to interpret.
 *
 * Every published package appears, in the order the travel desk set in
 * the dashboard, so which tours lead is an ops decision rather than a
 * constant in this file.
 *
 * Deliberately not auto-advancing, unlike the hero: these cards carry
 * prices and dates, and a rail that moves while someone is comparing two
 * of them is actively hostile.
 */
export function TripsThisMonth({ trips }: { trips: TripCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  // Also on resize: a rail that fits at one width overflows at another,
  // and the arrows have to disappear and reappear with it.
  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges, trips.length]);

  function scrollByCard(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length === 0) return;

    const origin = cards[0].offsetLeft;
    const offsets = cards.map((card) => card.offsetLeft - origin);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollTo({
      left: nextSnapOffset(offsets, el.scrollLeft, direction),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  if (trips.length === 0) return null;

  const scrollable = !(atStart && atEnd);

  return (
    <section className="texture-stipple bg-cream-dark py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h2 className="font-display text-navy min-w-0 text-[1.6rem] leading-tight font-extrabold sm:text-4xl">
            Trips you can join this month
          </h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[0.6rem] font-semibold tracking-[0.12em] text-white uppercase sm:text-[0.7rem]">
            <span aria-hidden className="text-[0.5rem]">
              ◆
            </span>
            Senior Group Tours
            <span aria-hidden className="text-[0.5rem]">
              ◆
            </span>
          </span>

          {scrollable ? (
            <div className="ml-auto hidden items-center gap-2 sm:flex">
              <RailArrow side="left" disabled={atStart} onClick={() => scrollByCard(-1)} />
              <RailArrow side="right" disabled={atEnd} onClick={() => scrollByCard(1)} />
            </div>
          ) : null}
        </div>

        {/* tabIndex makes the rail reachable by keyboard, so arrow keys can
            scroll it without tabbing through every card inside. */}
        <div
          ref={trackRef}
          onScroll={syncEdges}
          tabIndex={0}
          role="region"
          aria-label="Curated trips"
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {trips.map((trip) => (
            <div key={trip.id} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31.8%]">
              <TripCardView trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RailArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous trips" : "More trips"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white text-ink/70 shadow-sm ring-1 ring-black/5 transition",
        disabled ? "cursor-default opacity-35" : "hover:bg-cream",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

function TripCardView({ trip }: { trip: TripCard }) {
  const price = formatPriceInr(trip.priceFromInr);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[4/3]">
        {trip.imageUrl ? (
          <Image
            src={trip.imageUrl}
            alt={trip.name}
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 360px"
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-cream-dark" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <div className="flex items-end justify-between gap-2">
            <h3 className="font-display line-clamp-2 text-xl leading-tight font-bold text-white sm:text-2xl">
              {trip.name}
            </h3>
            {trip.durationLabel ? (
              <span className="shrink-0 self-end rounded-md bg-white/95 px-2 py-1 text-[0.6rem] font-semibold whitespace-nowrap text-brand">
                {trip.durationLabel}
              </span>
            ) : null}
          </div>

          {trip.datesLabel || trip.groupSizeLabel ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-white/90">
              {trip.datesLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {trip.datesLabel}
                </span>
              ) : null}
              {trip.groupSizeLabel ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" aria-hidden />
                  {trip.groupSizeLabel}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 items-end justify-between gap-3 px-4 py-4">
        <div>
          {price ? (
            <>
              <p className="text-[0.7rem] text-ink/55">Starting from</p>
              <p className="font-display text-price text-xl font-extrabold sm:text-[1.4rem]">
                {price}
              </p>
            </>
          ) : null}
        </div>
        <Link
          href={trip.href}
          onClick={() => track(EVENTS.PACKAGE_CARD_CLICK, { slug: trip.slug })}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          View Trip
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
