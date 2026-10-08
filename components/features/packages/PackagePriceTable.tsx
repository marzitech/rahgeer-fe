import Image from "next/image";
import { Check, X } from "lucide-react";
import { iconSrc } from "@/lib/content/travel-icons";
import type { IconLabel } from "@/lib/content/package-detail";
import { PackageActions } from "./PackageActions";

/**
 * What the fare covers, and what it does not — as the design draws it.
 *
 * One sand panel: the places on the route as a pill, then each list as
 * a grid of glyph-above-label, a hairline between them, and the brochure
 * and share buttons underneath. The two lists sit one above the other on
 * purpose and look identical: read alone, an inclusions list sounds
 * generous, and the exclusions in the same shape right below are what
 * stop a conversation at the end of a trip about a cost nobody mentioned.
 * Most tours inherit both from the shared defaults.
 */
export function PackagePriceTable({
  includes,
  excludes,
  placesCovered,
  title,
}: {
  includes: IconLabel[];
  excludes: IconLabel[];
  placesCovered: string[];
  title: string;
}) {
  if (includes.length === 0 && excludes.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="bg-sand rounded-3xl p-5 sm:p-8 lg:p-10">
        {placesCovered.length > 0 ? <RoutePill places={placesCovered} /> : null}

        <PriceGrid title="Tour Price Includes:" rows={includes} tone="include" />
        {includes.length > 0 && excludes.length > 0 ? (
          <hr className="my-7 border-t border-black/10 sm:my-9" />
        ) : null}
        <PriceGrid title="Tour Price Excludes:" rows={excludes} tone="exclude" />

        <PackageActions title={title} />
      </div>
    </section>
  );
}

/** "◆ INDORE – ◆ UJJAIN – ◆ OMKARESHWAR": the stops, as one maroon pill. */
function RoutePill({ places }: { places: string[] }) {
  return (
    <p className="bg-brand-deep mb-7 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full px-4 py-2.5 text-[0.75rem] font-semibold tracking-[0.08em] text-white uppercase sm:text-[0.8125rem]">
      {places.map((place, index) => (
        <span key={`${place}-${index}`} className="inline-flex items-center gap-x-2">
          {index > 0 ? <span aria-hidden>–</span> : null}
          <span aria-hidden className="inline-block size-2 rotate-45 bg-white" />
          {place}
        </span>
      ))}
    </p>
  );
}

function PriceGrid({
  title,
  rows,
  tone,
}: {
  title: string;
  rows: IconLabel[];
  tone: "include" | "exclude";
}) {
  if (rows.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-navy text-[1.125rem] font-extrabold tracking-wide uppercase sm:text-xl">
        {title}
      </h2>
      <ul className="mt-5 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-6">
        {rows.map((row, index) => (
          <li key={`${row.label}-${index}`}>
            {/* The dashboard picks a glyph per line. A line without one
                still needs a marker in a grid of glyphs, or it reads as
                a hole — and a tick or a cross says which list this is
                even after the heading has scrolled away. */}
            {row.icon ? (
              <Image
                src={iconSrc(row.icon)}
                alt=""
                width={40}
                height={40}
                className="size-10"
              />
            ) : tone === "include" ? (
              <Check className="text-brand-deep size-10" strokeWidth={1.5} aria-hidden />
            ) : (
              <X className="text-brand-deep size-10" strokeWidth={1.5} aria-hidden />
            )}
            <p className="text-navy mt-3 text-sm leading-snug sm:text-[0.9375rem]">{row.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
