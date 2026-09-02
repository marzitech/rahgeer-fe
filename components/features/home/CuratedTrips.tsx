import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "./DestinationCard";
import { PACKAGES } from "./destinations.data";
import { TalkToMitrButton } from "./TalkToMitrButton";

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

        {/* Vertical stack on mobile; grid row from sm up */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((destination) => (
            <DestinationCard key={destination.name} destination={destination} />
          ))}
        </div>

        {/* App design: "Have some doubts?" + Talk button under the cards. */}
        <div className="show-in-app mx-auto mt-8 max-w-md">
          <p className="font-display text-center text-lg font-bold">
            Have some doubts?
          </p>
          <div className="mt-3">
            <TalkToMitrButton
              form="app-curated-trips"
              className="bg-brand flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
