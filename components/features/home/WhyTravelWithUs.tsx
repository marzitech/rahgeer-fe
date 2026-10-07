"use client";

import Image from "next/image";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import type { SiteFeature } from "@/lib/content/home-content";

/**
 * "Why travel with us?" — the benefit rows, plus the talk-to-an-expert card.
 *
 * Rows are edited in the admin dashboard. Each carries an icon *key*
 * rather than an icon, because the dashboard cannot send a React
 * component — unknown keys fall back to the guide glyph instead of
 * leaving a hole in the row.
 */

const CALL_NUMBER = "+918792237778";

/** The designer's own icons, exported from the Figma file. */
const ICONS: Record<string, string> = {
  guide: "/images/figma/icon-user.svg",
  doctor: "/images/figma/icon-heart.svg",
  meals: "/images/figma/icon-utensils.svg",
  solo: "/images/figma/icon-shield.svg",
  door: "/images/figma/icon-car.svg",
};

export function WhyTravelWithUs({ features }: { features: SiteFeature[] }) {
  return (
    <section className="pt-4 pb-14 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-brand-deep text-[1.75rem] font-extrabold sm:text-[2.875rem]">
            Why travel with us?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:text-lg">
            From Planning to Booking. For all your Travel Needs
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ul className="space-y-5">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="flex items-center gap-5 rounded-3xl border border-[#e5d9cf] bg-[#fefefe] p-5 shadow-[0_10px_10px_rgba(0,0,0,0.05)] sm:p-6"
              >
                <span className="bg-sand-deep flex size-12 shrink-0 items-center justify-center rounded-full">
                  <Image
                    src={ICONS[feature.icon] ?? ICONS.guide}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </span>
                <div className="min-w-0">
                  <h3 className="text-brand-deep text-base font-semibold sm:text-lg">
                    {feature.title}
                  </h3>
                  {feature.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <ExpertCard />
        </div>
      </div>
    </section>
  );
}

function ExpertCard() {
  return (
    /* The portrait is a cut-out, and in the design his head rises above
       the maroon panel. That only works if the wrapper does not clip, so
       the rounded corners live on the panel itself rather than here. */
    <div className="relative pt-12 sm:pt-16">
      <div className="bg-sand overflow-hidden rounded-3xl border border-[#e5e7eb] shadow-[0_10px_20px_rgba(0,0,0,0.05)]">
        <div className="h-56 bg-[#65023d] sm:h-72" />

        <div className="p-6 sm:p-8">
          <h3 className="font-display text-navy text-xl font-bold sm:text-[1.5625rem]">
            Talk to an Expert
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Our travel experts are available 24/7 to help you plan your dream trip.
          </p>
          <a
            href={`tel:${CALL_NUMBER}`}
            onClick={() => track(EVENTS.CALL_CLICK_FOOTER, { section: "why_travel_with_us" })}
            className="bg-brand-deep hover:bg-brand mt-5 flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors"
          >
            Call Us Now
          </a>
        </div>
      </div>

      <Image
        src="/images/figma/expert-portrait.png"
        alt="A Marzi travel expert"
        width={1087}
        height={1447}
        sizes="(max-width: 1024px) 60vw, 320px"
        className="pointer-events-none absolute bottom-[calc(100%-17.5rem)] left-1/2 w-[58%] max-w-[19rem] -translate-x-1/2 sm:bottom-[calc(100%-22rem)]"
      />
    </div>
  );
}
