import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CARD_BLURB, type HomeDestination } from "./destinations.data";

/** One destination photo card — shared by "Curated Trips" (packages) and
 *  "Explore destinations". Handles the mobile-carousel width + desktop-grid
 *  sizing itself, so both sections wrap it the same way. */
export function DestinationCard({
  destination,
}: {
  destination: HomeDestination;
}) {
  // Priced trips are curated packages -> the package page; guides -> the
  // sample-itinerary page (teaser + download lead-gate).
  const href = destination.priceFromInr
    ? `/packages/${destination.slug}`
    : `/itineraries/${destination.slug}`;

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-[88%] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-auto sm:shrink"
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 380px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {destination.priceFromInr ? (
        <span className="absolute top-4 right-4 rounded-xl bg-white px-4 py-2 text-center shadow-md transition group-hover:scale-105">
          <p className="text-foreground/60 text-xs">Starting from</p>
          <p className="text-brand text-lg leading-tight font-bold">
            ₹{destination.priceFromInr.toLocaleString("en-IN")}
          </p>
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 pt-20">
        <h3 className="font-display text-[26px] font-semibold text-white">
          {destination.name}
        </h3>
        <p className="mt-1 text-sm leading-snug text-white/80">{CARD_BLURB}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[15px] font-bold text-white transition group-hover:gap-2">
          {destination.cta}
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
