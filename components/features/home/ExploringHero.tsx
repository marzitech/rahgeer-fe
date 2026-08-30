import Image from "next/image";
import { Plane } from "lucide-react";

/** Traveller story shown in the hero. Add entries to rotate stories —
 *  the first one renders for now. */
const STORIES = [
  {
    image: "/images/home/hero-story-paris.jpg",
    names: "Mr. & Mrs. Mehta",
    destination: "Paris",
    occasion: "Anniversary",
  },
];

/** Redesigned hero: "Indian seniors are exploring…" over a full-bleed
 *  traveller-story photo with the caption card ("Mr. & Mrs. Mehta went to
 *  Paris for their Anniversary."), dissolving into the cloud band with the
 *  outlined "Marzi Mitr" watermark. */
export function ExploringHero() {
  const story = STORIES[0];

  return (
    <section className="overflow-hidden bg-white pt-16 md:pt-20">
      <div className="relative">
        {/* Mobile: headline on white above the photo. Desktop: overlaid on
            the photo's sky (per the design). */}
        <h1 className="font-display py-5 text-center text-[30px] leading-tight font-bold text-balance md:absolute md:inset-x-0 md:top-14 md:z-10 md:py-0 md:text-[48px] md:text-white">
          <span className="text-gold">Indian seniors</span> are exploring...
        </h1>

        <div className="relative h-[400px] overflow-hidden md:h-[620px]">
          <Image
            src={story.image}
            alt={`${story.names} in ${story.destination}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_bottom]"
          />
          {/* Soften the bright sky behind the desktop headline */}
          <div className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-black/25 to-transparent md:block" />

          {/* Story caption card */}
          <p className="absolute inset-x-0 bottom-7 mx-auto w-fit max-w-[90%] rounded-xl bg-white px-5 py-3 text-center text-sm leading-relaxed font-semibold shadow-lg md:bottom-9 md:text-[15px]">
            {story.names} went to{" "}
            <span className="text-brand font-bold">{story.destination}</span>
            <br className="md:hidden" /> for their{" "}
            <span className="text-brand font-bold">{story.occasion}.</span>
          </p>
        </div>
      </div>

      <CloudsDivider />
    </section>
  );
}

/** Decorative hand-off band: the cloud art, a dashed flight path with
 *  planes in the sky gap, and the outlined serif watermark. */
function CloudsDivider() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-36 overflow-hidden md:h-56"
    >
      {/* Cloud band — anchored to the band's bottom edge so the dense cloud
          mass fills the strip and hugs the Mitr card below (per the design);
          zoomed on mobile so the clouds stay dense */}
      <Image
        src="/images/home/hero-clouds.png"
        alt=""
        width={1264}
        height={421}
        sizes="100vw"
        className="absolute bottom-0 left-1/2 h-auto w-[160%] max-w-none -translate-x-1/2 opacity-30 md:w-full"
      />

      {/* Dashed flight path + planes in the sky gap (desktop only) */}
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 hidden h-1/2 w-full md:block"
      >
        <path
          d="M80 170 C 320 40, 520 40, 600 100 C 680 160, 900 60, 1120 90"
          stroke="#cfc8bc"
          strokeWidth="2"
          strokeDasharray="7 8"
        />
      </svg>
      <Plane
        className="absolute top-[30%] left-[5%] hidden size-6 -rotate-12 text-[#b9b2a6] md:block"
        fill="currentColor"
        strokeWidth={0}
      />
      <Plane
        className="absolute top-[14%] right-[6%] hidden size-6 rotate-12 text-[#b9b2a6] md:block"
        fill="currentColor"
        strokeWidth={0}
      />

      {/* Outlined watermark over the clouds, hugging the Mitr card below */}
      <p className="font-display absolute inset-x-0 bottom-0 text-center text-[48px] leading-none font-bold whitespace-nowrap text-transparent [-webkit-text-stroke:2px_#d5cfc6] md:text-[110px]">
        Marzi Mitr
      </p>
    </div>
  );
}
