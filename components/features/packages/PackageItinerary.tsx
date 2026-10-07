"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PackageDay } from "@/lib/content/package-detail";
import { cn } from "@/lib/utils";

/**
 * "Your Itinerary" — day tabs over a timeline of that day's stops.
 *
 * One day at a time rather than every day stacked: a five-day tour runs
 * to fifteen stops with a photo each, and nobody scrolls that to compare
 * day two with day four.
 */
export function PackageItinerary({ days }: { days: PackageDay[] }) {
  const [active, setActive] = useState(0);
  if (days.length === 0) return null;

  const day = days[Math.min(active, days.length - 1)];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[1.75rem] font-extrabold text-[#1d161d] sm:text-4xl">
          Your Itinerary
        </h2>
        <span className="font-label text-brand-deep inline-flex items-center gap-1.5 rounded-full bg-[#fcebf3] px-4 py-2 text-sm font-bold">
          {days.length} {days.length === 1 ? "Day" : "Days"} Trip
          <ChevronDown className="size-3" aria-hidden />
        </span>
      </div>

      {days.length > 1 ? (
        <div
          role="tablist"
          aria-label="Itinerary days"
          className="mt-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {days.map((d, i) => (
            <button
              key={d.day}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "font-label shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors",
                i === active
                  ? "bg-brand-deep font-bold text-white"
                  : "border border-[#eadfd5] bg-white font-semibold text-[#6d6d6d] hover:border-brand/30",
              )}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      ) : null}

      <div className="bg-brand-deep mt-6 rounded-2xl px-6 py-5 text-white sm:px-8">
        <p className="font-label text-lg font-extrabold sm:text-[1.375rem]">
          Day {day.day}
          {day.title ? ` · ${day.title}` : ""}
        </p>
        {day.description ? (
          <p className="font-label mt-1.5 text-sm font-medium text-white/85 sm:text-[0.9375rem]">
            {day.description}
          </p>
        ) : null}
      </div>

      <ol className="mt-8">
        {day.stops.map((stop, i) => {
          const last = i === day.stops.length - 1;
          return (
            <li key={`${day.day}-${i}`} className="flex gap-5 sm:gap-6">
              {/* Rail: the number, and a line joining it to the next stop. */}
              <div className="flex w-8 shrink-0 flex-col items-center">
                <span className="bg-brand-deep font-label flex size-8 items-center justify-center rounded-full text-sm font-bold text-white">
                  {i + 1}
                </span>
                {!last ? <span className="w-0.5 flex-1 bg-[#eadfd5]" /> : null}
              </div>

              <div className={cn("min-w-0 flex-1", !last && "pb-9")}>
                <h3 className="font-label text-brand-deep text-base font-bold sm:text-lg">
                  {stop.title}
                </h3>
                {stop.time ? (
                  <p className="font-label mt-1 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#6d6d6d]">
                    <Image
                      src="/images/figma/icon-clock.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5"
                    />
                    {stop.time}
                  </p>
                ) : null}
                {stop.description ? (
                  <p className="font-label mt-3 text-sm leading-relaxed text-[#6d6d6d] sm:text-[0.9375rem]">
                    {stop.description}
                  </p>
                ) : null}
                {stop.image ? (
                  <div className="relative mt-3 h-44 w-full overflow-hidden rounded-2xl sm:h-[220px]">
                    <Image
                      src={stop.image}
                      alt={stop.title}
                      fill
                      sizes="(max-width: 1152px) 100vw, 1100px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
