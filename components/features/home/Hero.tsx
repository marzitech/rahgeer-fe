import Image from "next/image";
import { LeadForm } from "./LeadForm";

// Brand persona art (shared with the reviews section)
const TRUSTED_AVATARS = [
  "/images/home/reviewer-anita.jpg",
  "/images/home/reviewer-priya.jpg",
  "/images/home/reviewer-vikram.jpg",
];

/** Full-viewport hero: the Udaipur sunset photo covers the entire first
 *  screen (the fixed header floats on top of it); dark-left overlay for
 *  legibility, trusted-by pill, serif headline, lead form card right. */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden lg:min-h-screen"
    >
      <Image
        src="/images/home/hero-koh-tao.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Legibility overlays: darken overall + stronger on the text side
          (on mobile the text spans the full width, so darken evenly) */}
      <div className="absolute inset-0 bg-black/30 lg:bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-black/10 lg:to-transparent" />

      <div className="relative mx-auto grid w-full max-w-[1192px] grid-cols-1 items-center gap-6 px-4 pt-20 pb-8 md:gap-10 md:pt-28 md:pb-12 lg:grid-cols-[1fr_480px] lg:gap-12 lg:pt-32 lg:pb-14">
        <div className="lg:col-start-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow">
            <div className="flex -space-x-2">
              {TRUSTED_AVATARS.map((src) => (
                <span
                  key={src}
                  className="relative size-7 overflow-hidden rounded-full border-2 border-white"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </span>
              ))}
            </div>
            <p className="text-xs font-medium text-green-700">
              Trusted by <strong>1000+</strong> families across India
            </p>
          </div>

          <h1 className="font-display mt-4 text-[28px] leading-[1.2] font-bold text-white md:mt-6 md:text-[44px] lg:mt-8 lg:text-[52px] lg:leading-[1.15]">
            Travel Confidently
            <br />
            Your <span className="text-gold">Travel Mitr</span> takes care of{" "}
            <span className="text-gold">Everything</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 md:mt-4 md:text-lg lg:mt-6">
            Marzi is India&apos;s first dedicated travel platform for people
            above 50 – from planning to booking.
          </p>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}
