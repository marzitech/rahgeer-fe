"use client";

import Image from "next/image";
import {
  DoorOpen,
  HeartPulse,
  Shield,
  UserRound,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import type { SiteFeature } from "@/lib/content/home-content";

/**
 * "Why travel with us?" — the benefit rows, plus the talk-to-an-expert card.
 *
 * Rows are edited in the admin dashboard. Each carries an icon *key*
 * rather than an icon, because the dashboard cannot send a React
 * component — unknown keys fall back to a neutral glyph instead of
 * leaving a hole in the row.
 */

const CALL_NUMBER = "+918792237778";

const ICONS: Record<string, LucideIcon> = {
  guide: UserRound,
  doctor: HeartPulse,
  meals: Utensils,
  solo: Shield,
  door: DoorOpen,
  group: UserRound,
  support: HeartPulse,
  shield: Shield,
};

export function WhyTravelWithUs({ features }: { features: SiteFeature[] }) {
  return (
    <section className="bg-cream py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-brand sm:text-3xl">
            Why travel with us?
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            From Planning to Booking. For all your Travel Needs
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ul className="space-y-3">
            {features.map((feature) => {
              const Icon = ICONS[feature.icon] ?? UserRound;
              return (
                <li
                  key={feature.id}
                  className="flex gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-brand">{feature.title}</h3>
                    {feature.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-ink/70">
                        {feature.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>

          <ExpertCard />
        </div>
      </div>
    </section>
  );
}

function ExpertCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand">
      <div className="relative h-56 sm:h-72">
        <Image
          src="/images/home/travel-mitr-portrait.jpg"
          alt="A Marzi travel expert"
          fill
          sizes="(max-width: 1024px) 100vw, 480px"
          className="object-cover object-top"
        />
      </div>

      <div className="m-4 rounded-xl bg-white p-4 shadow-sm">
        <h3 className="font-display text-lg font-bold text-ink">Talk to an Expert</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink/70">
          Our travel experts are available 24/7 to help you plan your dream trip.
        </p>
        <a
          href={`tel:${CALL_NUMBER}`}
          onClick={() => track(EVENTS.CALL_CLICK_FOOTER, { section: "why_travel_with_us" })}
          className="mt-3 flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Call Us Now
        </a>
      </div>
    </div>
  );
}
