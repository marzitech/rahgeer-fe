"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { listPackages } from "@/lib/api/endpoints";
import type {
  DestinationContent,
  FeaturedItinerary,
} from "@/lib/content/destinations";

type BackendPackage = {
  id: string;
  display_name: string;
  summary: string;
  default_duration_nights: number | null;
  price_from_inr: number | null;
};

/** "Choose Package That Feels Right" — horizontal itinerary cards per the
 *  design: photo left; meta line, name, blurb, price + black View
 *  Itinerary pill right. Live backend packages for the destination are
 *  merged after the curated featured list. */
export function FeaturedItineraries({
  destination,
}: {
  destination: DestinationContent;
}) {
  const [backendPackages, setBackendPackages] = useState<BackendPackage[]>([]);

  useEffect(() => {
    listPackages(destination.name)
      .then((data) => setBackendPackages(data.results as BackendPackage[]))
      .catch(() => {}); // live packages are additive — page works without them
  }, [destination.name]);

  const cards: FeaturedItinerary[] = [
    ...destination.featured,
    ...backendPackages.map((pkg) => ({
      name: pkg.display_name,
      meta: pkg.default_duration_nights
        ? `${destination.name} · ${pkg.default_duration_nights + 1} Days`
        : destination.name,
      description: pkg.summary,
      priceFromInr: pkg.price_from_inr ?? 0,
      image: destination.image,
    })),
  ];

  return (
    <section className="bg-gradient-to-b from-[#fdeef5] to-white py-16">
      <div className="mx-auto max-w-[1192px] px-4">
        <div className="text-center">
          <p className="text-brand text-sm font-semibold tracking-[0.2em] uppercase">
            Explore itineraries
          </p>
          <h2 className="font-display mt-3 text-[28px] font-semibold md:text-4xl">
            Choose Package That Feels Right
          </h2>
        </div>

        {cards.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-foreground/70">
              Our {destination.name} itineraries are being curated. Tell us what
              you&apos;re dreaming of and your Travel Mitr will build one for
              you.
            </p>
            <a
              href="/#plan-your-trip"
              className="bg-brand hover:bg-brand-deep mt-6 inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-white transition"
            >
              Plan my trip
            </a>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {cards.map((itinerary) => (
              <div
                key={itinerary.name}
                className="flex overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
              >
                <div className="relative w-[150px] shrink-0 md:w-[190px]">
                  <Image
                    src={itinerary.image}
                    alt=""
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-5">
                  <p className="text-brand flex items-center gap-1 text-xs font-medium">
                    <MapPin className="h-3.5 w-3.5" />
                    {itinerary.meta}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold">{itinerary.name}</h3>
                  <p className="text-foreground/60 mt-1 text-[13px] leading-snug">
                    {itinerary.description}
                  </p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-foreground/50 text-xs">
                        Starting from
                      </p>
                      <p className="text-brand text-xl leading-tight font-bold">
                        ₹{itinerary.priceFromInr.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <a
                      href="/#plan-your-trip"
                      className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/85"
                    >
                      View Itinerary
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
