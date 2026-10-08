"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PackageDay } from "@/lib/content/package-detail";
import { cn } from "@/lib/utils";

/**
 * "Your Itinerary" — every day listed, one open at a time.
 *
 * An accordion rather than only tabs: a five-day tour runs to fifteen
 * stops with a photo each, so showing them all at once buries the days
 * below it. Collapsed, you can see the whole shape of the trip and open
 * the day you care about. The tabs along the top are the shortcut for
 * people who already know which day that is.
 */
export function PackageItinerary({ days }: { days: PackageDay[] }) {
  const [open, setOpen] = useState(0);
  if (days.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[1.75rem] font-extrabold text-[#1d161d] sm:text-4xl">
          Your Itinerary
        </h2>
        <span className="font-label text-brand-deep inline-flex items-center gap-1.5 rounded-full bg-[#fcebf3] px-4 py-2 text-sm font-bold">
          {days.length} {days.length === 1 ? "Day" : "Days"} Trip
        </span>
      </div>

      {days.length > 1 ? (
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((d, i) => (
            <button
              key={d.day}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Jump to day ${d.day}`}
              className={cn(
                "font-label shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors",
                i === open
                  ? "bg-brand-deep font-bold text-white"
                  : "hover:border-brand/30 border border-[#eadfd5] bg-white font-semibold text-[#6d6d6d]",
              )}
            >
              Day {d.day}
              {i === open ? " (Active)" : ""}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {days.map((day, i) => {
          const expanded = i === open;
          return (
            <div key={day.day}>
              <button
                type="button"
                aria-expanded={expanded}
                // Clicking the open day closes it: the whole trip at a
                // glance is a legitimate thing to want.
                onClick={() => setOpen(expanded ? -1 : i)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl px-6 py-5 text-left transition-colors sm:px-8",
                  expanded
                    ? "bg-brand-deep text-white"
                    : "border border-[#eadfd5] bg-white hover:border-brand/30",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "font-label block text-base font-extrabold sm:text-[1.375rem]",
                      expanded ? "text-white" : "text-navy",
                    )}
                  >
                    Day {day.day}
                    {day.title ? ` · ${day.title}` : ""}
                  </span>
                  {day.description ? (
                    <span
                      className={cn(
                        "font-label mt-1 block text-sm font-medium",
                        expanded ? "text-white/85" : "text-[#6d6d6d]",
                      )}
                    >
                      {day.description}
                    </span>
                  ) : null}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 transition-transform",
                    expanded ? "rotate-180 text-white" : "text-[#6d6d6d]",
                  )}
                />
              </button>

              {expanded && day.stops.length > 0 ? (
                <ol className="mt-6 px-1 sm:px-2">
                  {day.stops.map((stop, s) => {
                    const last = s === day.stops.length - 1;
                    return (
                      <li key={`${day.day}-${s}`} className="flex gap-5 sm:gap-6">
                        {/* Rail: the number, and a line to the next stop. */}
                        <div className="flex w-8 shrink-0 flex-col items-center">
                          <span className="bg-brand-deep font-label flex size-8 items-center justify-center rounded-full text-sm font-bold text-white">
                            {s + 1}
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
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
