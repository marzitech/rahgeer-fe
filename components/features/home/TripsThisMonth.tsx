"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { formatPriceInr, type TripCard } from "@/lib/content/trips";

/**
 * "Trips you can join this month" — the curated group tours rail.
 *
 * Cards come from the packages API, in the order the travel desk set in
 * the dashboard, so the lead trip can be changed without a deploy.
 */
export function TripsThisMonth({ trips }: { trips: TripCard[] }) {
  if (trips.length === 0) return null;

  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Trips you can join this month
          </h2>
          <span className="rounded-full border border-brand/30 px-3 py-1 text-[0.65rem] font-semibold tracking-wider text-brand uppercase">
            Senior Group Tours
          </span>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.slice(0, 6).map((trip) => (
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <h3 className="font-display absolute bottom-3 left-4 text-xl font-bold text-white">
          {trip.name}
        </h3>
        {trip.durationLabel ? (
          <span className="absolute right-3 bottom-3 rounded-md bg-brand px-2 py-1 text-[0.65rem] font-semibold text-white">
            {trip.durationLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/70">
          {trip.datesLabel ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              {trip.datesLabel}
            </span>
          ) : null}
          {trip.packageType ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              {trip.packageType}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            {price ? (
              <>
                <p className="text-[0.65rem] text-ink/60">Starting from</p>
                <p className="font-display text-lg font-bold text-brand">{price}</p>
              </>
            ) : null}
          </div>
          <Link
            href={trip.href}
            onClick={() => track(EVENTS.PACKAGE_CARD_CLICK, { slug: trip.slug })}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            View Trip
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
