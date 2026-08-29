import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Plane, Users } from "lucide-react";
import {
  destinationHref,
  HERO_DESTINATIONS,
  type HomeDestination,
} from "./destinations.data";
import { SeniorFriendlyBadge } from "./SeniorFriendlyBadge";

/** Redesigned hero: "Indian seniors are exploring…" over a horizontal rail
 *  of destination cards (photo, Senior Friendly dial, social proof, Explore
 *  Trip), dissolving into a cloud band with the outlined "Marzi Mitr"
 *  watermark that hands off to the Mitr card below. */
export function ExploringHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 md:pt-36">
      <h1 className="font-display px-4 text-center text-[30px] leading-tight font-bold text-balance md:text-[48px]">
        <span className="text-brand">Indian seniors</span> are exploring...
      </h1>

      {/* Card rail — horizontal snap scroll on every breakpoint; the left
          padding lines the first card up with the 1192px content column. */}
      <div className="mt-8 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto px-4 pb-10 md:mt-12 md:gap-6 md:px-[max(2.5rem,calc((100vw-1192px)/2))] [&::-webkit-scrollbar]:hidden">
        {HERO_DESTINATIONS.map((destination) => (
          <HeroCard key={destination.slug} destination={destination} />
        ))}
      </div>

      <CloudsDivider />
    </section>
  );
}

function HeroCard({ destination }: { destination: HomeDestination }) {
  return (
    <Link
      href={destinationHref(destination)}
      className="group relative block w-[230px] shrink-0 snap-center overflow-hidden rounded-[26px] border-[5px] border-white bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:w-[252px] md:snap-start"
    >
      <div className="relative aspect-[10/13] overflow-hidden rounded-[21px]">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="252px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 pt-20">
          <h3 className="font-display text-xl font-semibold text-white">
            {destination.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-white">
            <Users className="text-marzi-pink h-3.5 w-3.5" strokeWidth={2.5} />
            {destination.seniorsTravelled} Seniors Travelled
          </p>
          <span className="bg-brand mt-3 flex items-center justify-center gap-1 rounded-full py-2.5 text-sm font-bold text-white transition group-hover:brightness-110">
            Explore Trip
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <SeniorFriendlyBadge pct={destination.seniorFriendlyPct ?? 0} />
        </div>
      </div>
    </Link>
  );
}

/** Decorative hand-off band: the cloud art fogging the card bottoms, a
 *  dashed flight path with planes in the sky gap, and the outlined serif
 *  watermark over the clouds. */
function CloudsDivider() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative -mt-10 h-36 overflow-hidden md:-mt-20 md:h-56"
    >
      {/* Cloud band — cropped to the band height (per the design's tight
          ~170px strip); zoomed on mobile so the clouds stay dense */}
      <Image
        src="/images/home/hero-clouds.png"
        alt=""
        width={1264}
        height={421}
        sizes="100vw"
        className="absolute top-0 left-1/2 h-auto w-[160%] max-w-none -translate-x-1/2 opacity-20 md:w-full"
      />
      {/* Fade the crop line into the white below */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-white" />

      {/* Dashed flight path + planes in the sky gap (desktop only) */}
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 hidden h-1/2 w-full md:block"
      >
        <path
          d="M80 170 C 320 40, 520 40, 600 100 C 680 160, 900 60, 1120 90"
          stroke="#cfc8bc"
          strokeWidth="2"
          strokeDasharray="7 8"
        />
      </svg>
      <Plane
        className="absolute top-[30%] left-[5%] hidden size-6 -rotate-12 text-[#b9b2a6] md:block"
        fill="currentColor"
        strokeWidth={0}
      />
      <Plane
        className="absolute top-[14%] right-[6%] hidden size-6 rotate-12 text-[#b9b2a6] md:block"
        fill="currentColor"
        strokeWidth={0}
      />

      {/* Outlined watermark over the clouds, hugging the Mitr card below */}
      <p className="font-display absolute inset-x-0 bottom-0 text-center text-[48px] leading-none font-bold whitespace-nowrap text-transparent [-webkit-text-stroke:2px_#d5cfc6] md:text-[110px]">
        Marzi Mitr
      </p>
    </div>
  );
}
