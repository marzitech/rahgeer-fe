import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Tell us about your holiday",
    description: "",
  },
  {
    title: "Receive a personalised plan",
    description:
      "Curated itineraries designed for your pace, comfort and interests.",
  },
  { title: "We book everything", description: "" },
  { title: "Enjoy your holiday", description: "" },
];

/** "Simple. Personal. Yours." — magenta band, numbered steps + photo. */
export function HowItWorks() {
  return (
    <section className="from-brand-deep to-brand bg-gradient-to-b py-20 text-white">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          dark
          eyebrow="How Marzi works"
          title="Simple. Personal. Yours."
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_640px]">
          <ol className="relative space-y-2 border-l border-white/25 pl-8">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative py-4">
                <span
                  aria-hidden
                  className="bg-gold text-ink absolute top-6 -left-[41px] flex size-6 items-center justify-center rounded-full text-xs font-bold"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-2xl font-semibold">
                  {step.title}
                </h3>
                {step.description ? (
                  <p className="mt-2 max-w-md text-sm text-white/80">
                    {step.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <ImagePlaceholder
            label="Family planning with Travel Mitr"
            className="h-[480px] w-full rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
