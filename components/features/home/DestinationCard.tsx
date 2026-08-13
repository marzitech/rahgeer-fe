import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_BLURB, type HomeDestination } from "./destinations.data";

/** One destination photo card. `compact` shrinks the text/padding for the
 *  Explore grid (2-across, smaller on mobile); the full size is used by the
 *  Curated Trips feature stack. */
export function DestinationCard({
  destination,
  compact = false,
}: {
  destination: HomeDestination;
  compact?: boolean;
}) {
  // Priced trips are curated packages -> the package page; guides -> the
  // sample-itinerary page (teaser + download lead-gate).
  const href = destination.priceFromInr
    ? `/packages/${destination.slug}`
    : `/itineraries/${destination.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl sm:rounded-3xl",
        // Explore grid: shorter/wider on desktop so the 2x2 fits one screen.
        compact ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/3]",
      )}
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 380px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {destination.priceFromInr ? (
        <span className="absolute top-2.5 right-2.5 rounded-lg bg-white px-2.5 py-1.5 text-center shadow-md transition group-hover:scale-105 sm:top-4 sm:right-4 sm:rounded-xl sm:px-4 sm:py-2">
          <p className="text-foreground/60 text-[10px] sm:text-xs">
            Starting from
          </p>
          <p className="text-brand text-sm leading-tight font-bold sm:text-lg">
            ₹{destination.priceFromInr.toLocaleString("en-IN")}
          </p>
        </span>
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent",
          compact ? "p-2.5 pt-10 sm:p-5 sm:pt-16 lg:p-6" : "p-6 pt-20",
        )}
      >
        <h3
          className={cn(
            "font-display font-semibold text-white",
            // Mobile compact cards show only a smaller name; blurb + CTA
            // appear from sm up.
            compact ? "text-xs sm:text-xl lg:text-2xl" : "text-[26px]",
          )}
        >
          {destination.name}
        </h3>
        <p
          className={cn(
            "leading-snug text-white/80",
            compact
              ? "mt-1 line-clamp-2 hidden text-sm sm:block"
              : "mt-1 text-sm",
          )}
        >
          {CARD_BLURB}
        </p>
        <span
          className={cn(
            "items-center gap-1 font-bold text-white transition group-hover:gap-2",
            compact
              ? "mt-2 hidden text-[15px] sm:inline-flex"
              : "mt-4 inline-flex text-[15px]",
          )}
        >
          {destination.cta}
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
