import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURES = [
  "Dedicated Travel Mitr for all travel planning and queries",
  "Trip planning personalized to your preferences and needs",
  "End to end support for booking flights, stay and local attractions",
  "7 days a week on-call support",
  "Dedicated support for managing Forex, VISA and Travel Insurance",
];

function Check() {
  return (
    <span className="inline-flex size-8 items-center justify-center rounded-full bg-green-100 text-green-700">
      ✓
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex size-8 items-center justify-center rounded-full bg-red-100 text-red-500">
      ✕
    </span>
  );
}

/** "Why Marzi is different" — Marzi vs Others comparison table. */
export function Comparison() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading eyebrow="Comparison" title="Why Marzi is different" />

        <div className="mt-12 overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-black/10">
                <th className="w-[40%] p-6 text-lg font-semibold">Feature</th>
                <th className="bg-brand-deep p-6 text-center text-white">
                  <span className="font-display text-xl font-semibold">
                    Marzi
                  </span>
                  <span className="text-gold mt-1 block text-xs font-medium">
                    ★ Recommended
                  </span>
                </th>
                <th className="text-foreground/60 p-6 text-center text-lg font-semibold">
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
                  <td className="p-6 text-sm">{feature}</td>
                  <td className="bg-brand-deep/5 p-6 text-center">
                    <Check />
                  </td>
                  <td className="p-6 text-center">
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
