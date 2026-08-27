import Image from "next/image";
import { BadgeCheck, Phone } from "lucide-react";
import { SparkleChip } from "./SparkleChip";

const MITR = {
  name: "Nabeel Sarfaraz",
  portrait: "/images/home/travel-mitr-portrait.jpg",
  stats: [
    { value: "5000+", label: "Seniors Travelled" },
    { value: "200+", label: "Trips Planned" },
  ],
};

/** Crimson Mitr band under the hero watermark: verified portrait (desktop),
 *  name, travelled/planned stats and the black call CTA. The chip straddles
 *  the card's top edge per the design. */
export function MeetYourMitr() {
  return (
    <section className="bg-white px-4 pb-16 md:pb-20">
      <div className="relative mx-auto max-w-[1192px]">
        <div className="absolute inset-x-0 -top-3.5 z-[1] text-center">
          <SparkleChip label="Meet Your Marzi Mitr" />
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-[#8a1149] to-[#a3195b] px-6 pt-12 pb-6 text-white shadow-xl md:flex md:items-center md:gap-8 md:rounded-[32px] md:px-8 md:py-8">
          {/* Portrait with verified seal — desktop only per the design */}
          <div className="relative hidden shrink-0 md:block">
            <div className="relative size-[120px] overflow-hidden rounded-2xl">
              <Image
                src={MITR.portrait}
                alt={MITR.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <span className="absolute -top-2 -right-2 flex size-9 items-center justify-center rounded-full bg-green-700 ring-2 ring-white">
              <BadgeCheck className="h-5 w-5 text-white" />
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl font-bold md:text-[28px]">
              {MITR.name}
            </h2>
            <div className="mt-4 flex justify-center divide-x divide-white/25 md:mt-3 md:justify-start">
              {MITR.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="px-6 first:pl-0 md:px-8 md:first:pl-0"
                >
                  <p className="text-gold text-xl font-bold md:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/85">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#plan-your-trip"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black/85 md:mt-0 md:shrink-0"
          >
            <Phone className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            {/* Mobile frame labels the CTA with the Mitr's name */}
            <span className="md:hidden">Plan My Trip With Nabeel</span>
            <span className="hidden md:inline">Talk to a Marzi Mitr</span>
          </a>
        </div>
      </div>
    </section>
  );
}
