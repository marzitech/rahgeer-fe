import Image from "next/image";
import { Check, X } from "lucide-react";
import { iconSrc } from "@/lib/content/travel-icons";
import type { IconLabel } from "@/lib/content/package-detail";

/**
 * What the fare covers, and what it does not.
 *
 * The pair is deliberately side by side and the same size: read on its
 * own, an inclusions list sounds generous, and the exclusions beside it
 * are what stop a conversation at the end of a trip about a cost nobody
 * mentioned. Most tours inherit both from the shared defaults, so these
 * two lists usually read the same across the catalogue.
 */
export function PackagePriceTable({
  includes,
  excludes,
}: {
  includes: IconLabel[];
  excludes: IconLabel[];
}) {
  if (includes.length === 0 && excludes.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <PriceList title="Tour Price Includes" rows={includes} tone="include" />
        <PriceList title="Tour Price Excludes" rows={excludes} tone="exclude" />
      </div>
    </section>
  );
}

function PriceList({
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
    <div className="rounded-3xl bg-white p-6 sm:p-9">
      <h2 className="font-display text-brand-deep text-[1.5rem] font-extrabold sm:text-[1.75rem]">
        {title}
      </h2>
      <ul className="mt-6 space-y-4">
        {rows.map((row, index) => (
          <li key={`${row.label}-${index}`} className="flex gap-3.5">
            {/* The dashboard picks a glyph per line where one fits. Lines
                that carry none still need a marker, and a tick or a
                cross says which list you are reading even when the
                headings have scrolled away. */}
            {row.icon ? (
              <Image
                src={iconSrc(row.icon)}
                alt=""
                width={22}
                height={22}
                className="mt-0.5 size-5 shrink-0"
              />
            ) : tone === "include" ? (
              <Check className="text-teal mt-0.5 size-5 shrink-0" aria-hidden />
            ) : (
              <X className="text-brand mt-0.5 size-5 shrink-0" aria-hidden />
            )}
            <p className="text-sm leading-relaxed text-gray-700 sm:text-[0.9375rem]">
              {row.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
