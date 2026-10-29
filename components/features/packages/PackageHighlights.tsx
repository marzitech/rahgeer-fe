import Image from "next/image";
import { Check } from "lucide-react";
import type { TermDescription, TravelMitr } from "@/lib/content/package-detail";

/**
 * "Highlights" beside the Travel Mitr who runs the trip.
 *
 * The Mitr card is the reassurance half of the pair: the highlights say
 * what you will see, the card says who is with you while you see it.
 */
export function PackageHighlights({
  highlights,
  mitr,
}: {
  highlights: TermDescription[];
  mitr: TravelMitr | null;
}) {
  // Nothing to show on either side — skip the section entirely.
  if (highlights.length === 0 && !mitr) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {highlights.length > 0 ? (
          <div className="bg-sand rounded-3xl border border-[#e5e7eb] p-6 sm:p-9">
            <h2 className="font-display text-brand-deep text-[1.75rem] font-extrabold sm:text-4xl">
              Highlights
            </h2>
            <ul className="mt-6 space-y-4">
              {highlights.map((item) => (
                <li key={item.term} className="flex gap-3">
                  <Check className="text-teal mt-1 size-4 shrink-0" aria-hidden />
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    <span className="text-navy font-semibold">{item.term}</span>
                    {item.description ? ` — ${item.description}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div />
        )}

        {mitr ? <TravelMitrCard mitr={mitr} /> : null}
      </div>
    </section>
  );
}

/**
 * The Mitr's photo sits inside the card, above their details.
 *
 * It used to be positioned as a cut-out overhanging a maroon panel,
 * which only worked for the one bundled portrait it was built around: a
 * tall image whose subject filled the frame. Photos uploaded through the
 * dashboard are whatever shape the camera gave them, and a landscape one
 * came out as a small rectangle floating in the middle of the maroon.
 *
 * A fixed-ratio frame holds any of them. `object-cover` trims the edges
 * rather than letterboxing, and anchoring to the bottom keeps the
 * subject standing on the panel instead of drifting in the middle —
 * people are photographed head-up, so the bottom is the safe edge to
 * crop. The sand background shows through a cut-out's transparency.
 */
function TravelMitrCard({ mitr }: { mitr: TravelMitr }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5e7eb]">
      {mitr.photoUrl ? (
        <div className="bg-sand-deep relative aspect-[4/3] w-full">
          <Image
            src={mitr.photoUrl}
            alt={`${mitr.name}, a Marzi Travel Mitr`}
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover object-bottom"
          />
        </div>
      ) : null}
      <div className="bg-sand p-6">
        <p className="font-display text-navy text-xl font-bold">
          Tour Mitr: {mitr.name}
        </p>
        {mitr.languages ? (
          <p className="mt-1 text-sm text-gray-600">{mitr.languages}</p>
        ) : null}
        {mitr.tripsLabel ? (
          <p className="text-brand-deep mt-4 flex items-center gap-2 text-sm font-semibold">
            <Check className="size-4" aria-hidden />
            {mitr.tripsLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
