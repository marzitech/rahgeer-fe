"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { BackLink } from "@/components/BackLink";
import { ItineraryResult } from "@/components/features/plan/AiTripWizard";
import { getSampleItinerary, type Itinerary } from "@/lib/api/endpoints";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Hero photo per sample destination (placeholders — swap in real photos).
const HERO: Record<string, string> = {
  "north-east": "/images/destinations/kerala.jpg",
  goa: "/images/destinations/vietnam.jpg",
  himachal: "/images/destinations/kashmir.jpg",
  "karnataka-coorg": "/images/home/review-trip-1.jpg",
  rajasthan: "/images/destinations/rajasthan.jpg",
  gujarat: "/images/destinations/rajasthan.jpg",
  "sikkim-darjeeling": "/images/home/review-trip-2.jpg",
  "tamil-nadu": "/images/home/review-trip-1.jpg",
  kerala: "/images/destinations/kerala.jpg",
  "sri-lanka": "/images/destinations/vietnam.jpg",
  ladakh: "/images/destinations/kashmir.jpg",
  "dharamshala-amritsar": "/images/destinations/kashmir.jpg",
  "sikkim-darjeeling-gangtok": "/images/home/review-trip-2.jpg",
  nainital: "/images/destinations/europe.jpg",
};

/** Loads a curated sample itinerary by slug and renders the itinerary
 *  result screen (teaser on-screen; full dossier gated behind the download
 *  lead form — same flow as an AI-generated trip). */
export function SampleItineraryView({ slug }: { slug: string }) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [state, setState] = useState<"loading" | "error">("loading");

  useEffect(() => {
    let alive = true;
    getSampleItinerary(slug)
      .then((data) => {
        if (alive) setItinerary(data);
      })
      .catch(() => {
        if (alive) setState("error");
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state === "error") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="font-display text-brand text-2xl font-bold">
          Itinerary not found
        </p>
        <p className="text-foreground/70 mt-3 text-sm">
          We couldn&apos;t load this sample. Please try another destination.
        </p>
        <BackLink
          href="/#destinations"
          className="text-brand mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to destinations
        </BackLink>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span aria-hidden className="text-3xl">
          ✈️
        </span>
        <p className="font-display mt-4 text-xl font-bold">
          Loading your sample itinerary…
        </p>
      </div>
    );
  }

  const monthLabel = MONTHS[(itinerary.travel_month ?? 1) - 1] ?? "";
  const departure =
    typeof itinerary.departure_city === "string"
      ? itinerary.departure_city
      : "";
  const score = itinerary.ai_output?.gen_ev?.score ?? 80;

  return (
    <div className="mx-auto max-w-[1192px] px-4 py-8 print:p-0">
      <BackLink
        href="/#destinations"
        className="text-brand mb-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline print:hidden"
      >
        <ArrowLeft className="h-4 w-4" /> Back to destinations
      </BackLink>
      <ItineraryResult
        itinerary={itinerary}
        heroImage={HERO[slug] ?? "/images/home/hero-koh-tao.jpg"}
        monthLabel={monthLabel}
        departure={departure}
        score={score}
      />
    </div>
  );
}
