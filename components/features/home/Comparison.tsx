import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURES = [
  "Dedicated Travel Mitr for all your queries",
  "Personalised Trip Planning",
  "End to End Booking support",
  "24x7 On Call support",
  "Dedicated support for Forex, Visa, and Insurance",
];

function Check() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-green-100 text-sm text-green-700 md:size-8 md:text-base">
      ✓
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-red-100 text-sm text-red-500 md:size-8 md:text-base">
      ✕
    </span>
  );
}

/** "Why Marzi is different" — Marzi vs Others comparison table. All three
 *  columns stay visible on mobile (compact paddings + narrow tick columns,
 *  like the Figma mobile design) — no horizontal scrolling. */
export function Comparison() {
  return (
    <section className="hide-in-app bg-cream py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading eyebrow="Comparison" title="Why Marzi is different" />

        <div className="mt-12 overflow-hidden rounded-2xl border border-black/10 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/10">
                <th className="p-4 text-base font-semibold md:w-[40%] md:p-6 md:text-lg">
                  Feature
                </th>
                <th className="bg-brand-deep w-[86px] p-2 text-center text-white md:w-auto md:p-6">
                  <span className="font-display text-base font-semibold md:text-xl">
                    Marzi
                  </span>
                  {/* inline-flex + nowrap keeps the star glued before the
                      word — never wrapping onto its own line */}
                  <span className="text-gold mt-1 flex items-center justify-center gap-0.5 text-[9px] font-medium whitespace-nowrap md:text-xs">
                    <span aria-hidden>★</span>
                    Recommended
                  </span>
                </th>
                <th className="text-foreground/60 w-[64px] p-2 text-center text-base font-semibold md:w-auto md:p-6 md:text-lg">
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, i) => (
                <tr
                  key={feature}
                  className={
                    i < FEATURES.length - 1 ? "border-b border-black/5" : ""
                  }
                >
                  <td className="p-4 text-sm leading-relaxed md:p-6 md:text-base">
                    {feature}
                  </td>
                  <td className="bg-brand-deep/5 p-2 text-center md:p-6">
                    <Check />
                  </td>
                  <td className="p-2 text-center md:p-6">
                    <Cross />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
