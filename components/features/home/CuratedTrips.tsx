import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "./DestinationCard";
import { PACKAGES } from "./destinations.data";

/** "Curated Trips, Ready to Explore" — the priced package trips, above the
 *  full explore grid. Desktop: 3-col grid; mobile: horizontal snap scroll. */
export function CuratedTrips() {
  if (PACKAGES.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Trips"
          title="Curated Trips, Ready to Explore"
          subtitle="Ready-made journeys with everything handled — flights, stays, and pacing built for comfort."
        />

        <div className="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {PACKAGES.map((destination) => (
            <DestinationCard key={destination.name} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
