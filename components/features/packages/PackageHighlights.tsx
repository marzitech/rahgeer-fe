import Image from "next/image";
import { Check } from "lucide-react";
import type { TermDescription } from "@/lib/content/package-detail";

/**
 * "Highlights" beside the Travel Mitr who runs the trip.
 *
 * The Mitr card is the reassurance half of the pair: the highlights say
 * what you will see, the card says who is with you while you see it.
 */
export function PackageHighlights({ highlights }: { highlights: TermDescription[] }) {
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

        <TravelMitrCard />
      </div>
    </section>
  );
}

/**
 * The portrait is a cut-out and overhangs the top of the maroon panel,
 * so the wrapper must not clip — the rounding lives on the panel.
 */
function TravelMitrCard() {
  return (
    <div className="relative pt-14">
      <div className="overflow-hidden rounded-3xl border border-[#e5e7eb]">
        <div className="bg-brand-deep h-52 sm:h-56" />
        <div className="bg-sand p-6">
          <p className="font-display text-navy text-xl font-bold">Naveen</p>
          <p className="mt-1 text-sm text-gray-600">English · Hindi · Kannada</p>
          <p className="text-brand-deep mt-4 flex items-center gap-2 text-sm font-semibold">
            <Check className="size-4" aria-hidden />
            150+ Trips completed
          </p>
        </div>
      </div>

      <Image
        src="/images/figma/expert-portrait.png"
        alt="Naveen, a Marzi Travel Mitr"
        width={760}
        height={1012}
        sizes="(max-width: 1024px) 50vw, 260px"
        className="pointer-events-none absolute bottom-[calc(100%-16.5rem)] left-1/2 w-[52%] max-w-[16rem] -translate-x-1/2"
      />
    </div>
  );
}
