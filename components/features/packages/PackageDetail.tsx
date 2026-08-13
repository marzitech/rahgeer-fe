"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, Clock, MapPin, Phone, X } from "lucide-react";
import type { PackageContent } from "@/lib/content/packages";

/** Circular Gen EV Score ring (green). */
function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 34;
  return (
    <div className="relative mx-auto mt-4 size-24">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#e3efe4"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#2fa75f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - score / 100)}`}
        />
      </svg>
      <span className="font-display absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#2fa75f]">
        {score}
      </span>
    </div>
  );
}

/** Curated-package detail page (design: package view — hero, Why Tour With
 *  Marzi, Highlights, Gen EV + cost/Book Now sidebar, day-tabbed itinerary,
 *  Tour price includes/excludes). */
export function PackageDetail({ pkg }: { pkg: PackageContent }) {
  const [activeDay, setActiveDay] = useState(pkg.days[0]?.day ?? 1);
  const day = pkg.days.find((d) => d.day === activeDay) ?? pkg.days[0];

  return (
    <main className="bg-[#fdf7f2] pt-20 md:pt-24">
      <div className="mx-auto max-w-[1192px] px-4 py-8">
        <Link
          href="/#destinations"
          className="text-brand inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          <span aria-hidden>←</span> Back to Travel
        </Link>

        {/* Hero banner */}
        <div className="relative mt-4 overflow-hidden rounded-2xl">
          <Image
            src={pkg.image}
            alt={pkg.name}
            width={1160}
            height={420}
            className="h-[240px] w-full object-cover md:h-[300px]"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <span className="bg-gold inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Curated package · ready to book
            </span>
            <h1 className="font-display mt-3 text-2xl font-bold text-white md:text-[36px]">
              {pkg.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {pkg.datesLabel} · {pkg.durationLabel}
              </span>
              {pkg.fromCity ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  From {pkg.fromCity}
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                {pkg.packageType}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                {pkg.mealsLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Places covered */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-foreground/60 text-xs font-semibold tracking-wide uppercase">
            Places covered
          </span>
          {pkg.placesCovered.map((place) => (
            <span
              key={place}
              className="text-brand rounded-full bg-[#fdeef5] px-3 py-1 text-xs font-semibold"
            >
              {place}
            </span>
          ))}
        </div>

        {/* Body: content + sidebar */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Why Tour With Marzi */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl font-bold">
                Why Tour With Marzi?
              </h2>
              <ul className="mt-4 space-y-2.5">
                {pkg.whyTourWithMarzi.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Highlights */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl font-bold">Highlights</h2>
              <ul className="mt-4 space-y-3">
                {pkg.highlights.map((h) => (
                  <li key={h.term} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">
                      <strong className="text-foreground font-semibold">
                        {h.term}
                      </strong>{" "}
                      – {h.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Your Itinerary */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold">
                  Your Itinerary
                </h2>
                {pkg.days.length > 1 ? (
                  <div className="flex max-w-full [scrollbar-width:none] overflow-x-auto rounded-full bg-[#fdeef5] p-1 [&::-webkit-scrollbar]:hidden">
                    {pkg.days.map((d) => (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => setActiveDay(d.day)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                          d.day === day?.day
                            ? "bg-brand text-white"
                            : "text-foreground/70 hover:text-foreground"
                        }`}
                      >
                        Day {d.day}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {day ? (
                <>
                  <p className="text-foreground/60 mt-4 text-sm font-semibold">
                    Day {day.day}: {day.title}
                  </p>
                  <div className="mt-4">
                    {day.stops.map((stop, index) => (
                      <div
                        key={stop.title}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {index < day.stops.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute top-11 bottom-0 left-[19px] border-l-2 border-dashed border-black/10"
                          />
                        ) : null}
                        <span className="bg-brand font-display relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="flex-1 pt-1">
                          <p className="text-brand font-bold">{stop.title}</p>
                          <p className="text-foreground/60 mt-0.5 flex items-center gap-1.5 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {stop.time}
                          </p>
                          <p className="text-foreground/70 mt-1.5 text-sm leading-relaxed">
                            {stop.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </section>

            {/* Tour price includes / excludes */}
            <section className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-lg font-bold text-green-700">
                Tour price includes
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.priceIncludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
              <h2 className="font-display mt-6 text-lg font-bold text-red-600">
                Tour price excludes
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.priceExcludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24">
            {/* Gen EV Score */}
            <div className="rounded-2xl bg-gradient-to-b from-[#e8f8ec] to-white p-6 text-center shadow-sm">
              <p className="text-foreground/60 text-xs font-semibold tracking-[0.18em] uppercase">
                Gen EV Score
              </p>
              <ScoreRing score={pkg.genEvScore} />
              <p className="mt-3 text-sm font-bold tracking-wide uppercase">
                Senior-friendly
              </p>
              <p className="text-foreground/60 mt-2.5 text-xs leading-relaxed">
                Gen EV Score is Marzi&apos;s senior-travel index, scored across
                50+ parameters - comfort, accessibility, safety, and value for
                money.
              </p>
            </div>

            {/* Estimated cost + CTAs */}
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-foreground/60 text-xs">Estimated cost</p>
              <p className="font-display mt-1 text-4xl font-bold">
                ₹{pkg.priceFromInr.toLocaleString("en-IN")}
              </p>
              <Link
                href="/#plan-your-trip"
                className="mt-5 flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white py-3 text-sm font-semibold transition hover:border-black/40"
              >
                <Phone className="h-4 w-4" />
                Talk to a Travel Mitr
              </Link>
              <Link
                href="/#plan-your-trip"
                className="bg-brand hover:bg-brand-deep mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
