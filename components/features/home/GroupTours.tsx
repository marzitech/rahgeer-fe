import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Footprints,
  HousePlus,
  Soup,
  UserRoundCog,
} from "lucide-react";
import { PACKAGE_CONTENT, type PackageContent } from "@/lib/content/packages";
import { SeniorFriendlyBadge } from "./SeniorFriendlyBadge";
import { SparkleChip } from "./SparkleChip";

const ADVANTAGES = [
  { Icon: HousePlus, label: "24×7 doctor support" },
  { Icon: Soup, label: "3 meals every day" },
  { Icon: Footprints, label: "Senior-friendly pace" },
  { Icon: UserRoundCog, label: "Experienced Indian guide" },
];

/** "Trips you can join this month" — the curated group tours as photo cards
 *  with the Senior Friendly dial and a price/View Trip footer, plus the
 *  cream Marzi Advantages card closing the grid. */
export function GroupTours() {
  const tours = Object.values(PACKAGE_CONTENT);

  return (
    <section id="group-tours" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1192px] px-4 text-center">
        <SparkleChip label="Group Tours" />
        <h2 className="font-display mt-4 text-[28px] font-bold text-balance md:text-4xl">
          Trips you can join this month
        </h2>

        {/* Tour cards scroll horizontally in a clipped rail (per the design);
            the Marzi Advantages card stays pinned beside it on desktop and
            drops below the rail on smaller screens. */}
        <div className="mt-8 flex flex-col gap-6 text-left md:mt-10 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-5 [scrollbar-width:none] md:gap-6 lg:snap-x lg:snap-mandatory lg:flex-row lg:overflow-x-auto lg:pb-2 [&::-webkit-scrollbar]:hidden">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
          <div className="lg:w-[380px] lg:shrink-0">
            <AdvantagesCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function TourCard({ tour }: { tour: PackageContent }) {
  return (
    <Link
      href={`/packages/${tour.slug}`}
      className="group w-full overflow-hidden rounded-[26px] bg-white shadow-[0_14px_34px_rgba(0,0,0,0.12)] ring-1 ring-black/5 lg:w-[340px] lg:shrink-0 lg:snap-start"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <SeniorFriendlyBadge pct={tour.genEvScore} />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-14">
          <h3 className="font-display text-xl font-semibold text-white">
            {tour.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/90">
            <Clock className="h-3.5 w-3.5" />
            {tour.durationLabel}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div>
          <p className="text-foreground/60 text-[11px]">Starting From</p>
          <p className="text-lg leading-tight font-bold text-green-800">
            ₹{tour.priceFromInr.toLocaleString("en-IN")}
          </p>
        </div>
        <span className="bg-brand flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-bold text-white transition group-hover:brightness-110">
          View Trip
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}

function AdvantagesCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[26px] bg-[#f4eedd] p-6 py-10 text-center">
      <SparkleChip label="Marzi Advantages" className="bg-white/70" />
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
        {ADVANTAGES.map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <span className="bg-brand flex size-14 items-center justify-center rounded-full text-white">
              <Icon className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <p className="text-foreground max-w-[130px] text-sm leading-snug font-semibold">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
