import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { LeadForm } from "./LeadForm";

/** Hero: full-bleed Udaipur sunset photo, dark-left overlay for legibility,
 *  trusted-by pill, serif headline with gold accent, lead form card right. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/home/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Legibility overlays: darken overall + stronger on the text side */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      <div className="relative mx-auto grid max-w-[1192px] grid-cols-1 items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_480px] lg:py-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <ImagePlaceholder
                  key={i}
                  className="size-7 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="text-xs font-medium text-green-700">
              Trusted by <strong>1000+</strong> families across India
            </p>
          </div>

          <h1 className="font-display mt-8 text-[52px] leading-[1.15] font-bold text-white">
            Travel Confidently.
            <br />
            Your <span className="text-gold">Travel Mitr</span> Takes
            <br />
            Care of Everything.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            India&apos;s first dedicated travel platform for people above 50 —
            from planning to booking.
          </p>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}
