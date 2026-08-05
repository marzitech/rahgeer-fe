import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { LeadForm } from "./LeadForm";

/** Hero: purple→magenta gradient, headline + trusted-by, lead form card. */
export function Hero() {
  return (
    <section className="from-marzi-purple via-brand-deep to-brand-darker bg-gradient-to-b text-white">
      <div className="mx-auto grid max-w-[1192px] grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_480px]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <ImagePlaceholder
                  key={i}
                  className="size-9 rounded-full border-2 border-white/60"
                />
              ))}
            </div>
            <p className="text-sm text-white/85">
              Trusted by <strong>1000+</strong> families across India
            </p>
          </div>

          <h1 className="font-display mt-6 text-5xl leading-tight font-semibold text-balance">
            Travel Confidently.
            <br />
            Your <span className="text-gold italic">Travel Mitr</span> Takes
            Care of Everything.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            India&apos;s first dedicated travel platform for people above 50 —
            from planning to booking.
          </p>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}
