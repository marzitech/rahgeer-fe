import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { DESTINATION_CONTENT } from "@/lib/content/destinations";
import { FeaturedItineraries } from "./FeaturedItineraries";

/** Destination page — design: Figma node 3541-27094. */

export function generateStaticParams() {
  return Object.keys(DESTINATION_CONTENT).map((slug) => ({ slug }));
}

export default async function DestinationPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = DESTINATION_CONTENT[slug];
  if (!destination) notFound();

  return (
    <>
      <Header />
      <main>
        {/* Hero: destination photo with purple tint, breadcrumb, serif title,
            fading into the pale-pink content backdrop */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden md:min-h-[72vh]">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="bg-marzi-purple/60 absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#fdeef5]" />

          <div className="relative mx-auto w-full max-w-[1192px] px-4 pt-32 pb-14 md:pt-40 md:pb-16">
            <nav className="flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/#destinations" className="hover:text-white">
                Destinations
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{destination.name}</span>
            </nav>
            <h1 className="font-display mt-4 text-3xl font-bold text-white md:text-[40px]">
              Discover {destination.name}, At Your Own Pace
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
              {destination.heroTagline}
            </p>
          </div>
        </section>

        {/* Editorial content */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1192px] px-4 py-14">
            <h2 className="font-display text-[26px] font-semibold md:text-3xl">
              Discover {destination.name} at a Gentler Pace
            </h2>
            <p className="text-foreground/75 mt-4 max-w-3xl text-[15px] leading-relaxed">
              {destination.intro}
            </p>

            <p className="mt-6 text-[15px] font-semibold">Quick highlights:</p>
            <ul className="text-foreground/75 mt-2 space-y-1.5 text-[15px]">
              {destination.highlights.map((highlight) => (
                <li key={highlight.label} className="flex gap-2">
                  <span aria-hidden className="text-foreground/40">
                    •
                  </span>
                  <span>
                    {highlight.label}: {highlight.value}
                  </span>
                </li>
              ))}
            </ul>

            {/* Section photo (design: senior travellers strolling — interim
                brand art until the design's photo is exported) */}
            <div className="relative mt-10 h-[300px] w-full overflow-hidden rounded-2xl md:h-[440px]">
              <Image
                src="/images/home/review-trip-3.jpg"
                alt={`Travellers enjoying ${destination.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1160px"
                className="object-cover"
              />
            </div>

            <h2 className="font-display mt-12 text-[26px] font-semibold md:text-3xl">
              Why {destination.name} Is Worth Visiting
            </h2>
            <p className="text-foreground/75 mt-4 max-w-4xl text-[15px] leading-relaxed">
              {destination.whyVisit}
            </p>

            <h2 className="font-display mt-12 text-[26px] font-semibold md:text-3xl">
              What to Know Before You Go
            </h2>
            <div className="mt-6 max-w-4xl divide-y divide-black/10">
              {destination.knowBeforeYouGo.map((qa) => (
                <div key={qa.question} className="py-4">
                  <p className="text-[15px] font-bold">{qa.question}</p>
                  <p className="text-foreground/70 mt-1 text-[15px]">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FeaturedItineraries destination={destination} />

        <Faq />
      </main>
      <Footer />
    </>
  );
}
