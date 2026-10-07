"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { formatPriceInr, type TripCard } from "@/lib/content/trips";

/**
 * "Trips you can join this month" — the curated group tours.
 *
 * Every published package appears, in the order the travel desk set in
 * the dashboard. Which tours show and in what order is therefore an ops
 * decision: unpublish one and it leaves the grid, drag it up and it
 * leads. Three to a row, as the design draws it.
 */
export function TripsThisMonth({ trips }: { trips: TripCard[] }) {
  if (trips.length === 0) return null;

  return (
    <section className="texture-stipple bg-cream-dark py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h2 className="font-display text-navy text-[1.75rem] leading-tight font-extrabold sm:text-4xl">
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
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <li key={trip.id}>
              <TripCardView trip={trip} />
            </li>
          ))}
        </ul>
      </div>
    </section>
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
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
