"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import { BedDouble, Check } from "lucide-react";
import { percentDone, type PlanProgress } from "@/lib/api/progress";

/* What the planner is actually doing — each line mirrors a rule the
   backend gives the model, so nothing here is a promise we don't keep. */
const TIPS = [
  "Every day keeps an afternoon breather — sights in the morning, rest after lunch.",
  "Each stop comes with at least two ways to get there, rated for comfort.",
  "Every hotel is a real property, with a backup at a different price.",
  "Walking is kept to what you told us you're comfortable with.",
  "Your budget is added up line by line, so the total has no surprises.",
  "Once it's ready, a Travel Mitr can fine-tune any day with you.",
];

const STAGE_COPY: Record<PlanProgress["stage"], string> = {
  starting: "Getting started",
  researching: "Reading our travel notes",
  routing: "Sketching your route",
  days: "Planning each day",
  finalising: "Final checks on timings and budget",
};

function DayRow({
  day,
  writing,
}: {
  day: PlanProgress["days"][number];
  writing: boolean;
}) {
  const detail = day.blocks?.length ? day.blocks : day.highlights;
  return (
    <li className="flex gap-3 py-3">
      <span
        aria-hidden
        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
          day.ready
            ? "bg-teal text-white"
            : writing
              ? "bg-brand/10 text-brand motion-safe:animate-pulse"
              : "bg-sand-deep/70 text-foreground/60"
        }`}
      >
        {day.ready ? (
          <Check className="size-4" strokeWidth={3} />
        ) : (
          day.day_number
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground/45 text-[11px] font-semibold tracking-wide uppercase">
          Day {day.day_number}
          {writing && !day.ready ? " · writing" : ""}
        </p>
        {day.title ? (
          <p className="leading-snug font-semibold motion-safe:animate-[plan-in_400ms_ease-out]">
            {day.title}
          </p>
        ) : (
          <span className="bg-sand-deep/60 mt-1 block h-4 w-3/5 rounded motion-safe:animate-pulse" />
        )}
        {detail?.length ? (
          <p className="text-foreground/55 mt-0.5 truncate text-sm motion-safe:animate-[plan-in_400ms_ease-out]">
            {detail.join(" · ")}
          </p>
        ) : null}
      </div>
    </li>
  );
}

/** The loading screen while a trip is planned: the real trip appears as it
 *  is written — its title, then each day, then each day ticked off. */
export function GenerationProgress({
  progress,
  destination,
  monthLabel,
  heroImage,
}: {
  progress: PlanProgress;
  destination: string;
  monthLabel: string;
  heroImage?: string;
}) {
  const [tip, setTip] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const percent = percentDone(progress);
  const readyDays = progress.days.filter((d) => d.ready).length;
  const writing = progress.stage === "days";
  const status =
    progress.stage === "days"
      ? `${readyDays} of ${progress.days.length} days planned`
      : progress.step || STAGE_COPY[progress.stage];

  return (
    <div className="mx-auto max-w-xl py-6 md:py-10">
      <div className="flex items-center gap-3">
        {heroImage ? (
          <Image
            src={heroImage}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-2xl object-cover"
          />
        ) : null}
        <p className="text-foreground/60 text-sm">
          Planning{" "}
          <span className="text-foreground font-semibold">{destination}</span>
          {monthLabel ? ` · ${monthLabel.split(" ")[0]}` : ""} ·{" "}
          {progress.days.length} {progress.days.length === 1 ? "day" : "days"}
        </p>
      </div>

      <h1 className="font-display mt-5 text-2xl leading-tight font-bold md:text-[30px]">
        {progress.title ?? "We're thoughtfully planning your trip"}
      </h1>
      <p className="text-foreground/60 mt-2 min-h-[2.75rem] text-sm md:text-base">
        {progress.summary ?? TIPS[tip]}
      </p>

      <div className="mt-6">
        <div
          className="h-2 overflow-hidden rounded-full bg-black/8"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Trip planning progress"
        >
          <div
            className="bg-brand h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p
          className="text-foreground/70 mt-2 text-sm font-medium"
          aria-live="polite"
        >
          {status}
        </p>
      </div>

      <ol className="mt-6 divide-y divide-black/6 rounded-2xl border border-black/8 bg-white px-4">
        {progress.days.map((day) => (
          <DayRow key={day.day_number} day={day} writing={writing} />
        ))}
      </ol>

      {progress.hotels.length ? (
        <div className="mt-5 motion-safe:animate-[plan-in_400ms_ease-out]">
          <p className="text-foreground/45 text-[11px] font-semibold tracking-wide uppercase">
            Where you&apos;ll stay
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {progress.hotels.map((hotel) => (
              <li
                key={hotel}
                className="bg-sand inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
              >
                <BedDouble aria-hidden className="text-brand size-4" />
                {hotel}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {progress.summary ? (
        <p className="text-foreground/50 mt-6 text-sm">{TIPS[tip]}</p>
      ) : null}
    </div>
  );
}
