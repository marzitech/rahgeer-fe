import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const SERVICES = [
  { icon: "🧭", label: "Choose any destination" },
  { icon: "🗓", label: "Coordinate your booking" },
  { icon: "🏡", label: "Comfortable stays" },
  { icon: "🗺", label: "Customised itinerary" },
  { icon: "🎧", label: "Available on call" },
  { icon: "📄", label: "Handle paperwork" },
];

/** "One person. Every step of your journey." — dark gradient band with the
 *  dedicated Travel Mitr portrait and a marquee of service chips. */
export function TravelMitr() {
  return (
    <section className="from-ink via-brand-darker to-brand-deep overflow-hidden bg-gradient-to-b py-16 text-white">
      <div className="mx-auto max-w-[1192px] px-4 text-center">
        <h2 className="font-display text-4xl font-semibold">
          One person. Every step of your journey.
        </h2>

        <div className="mt-10 flex flex-col items-center">
          <ImagePlaceholder
            label="Travel Mitr"
            className="border-gold/60 size-[180px] rounded-full border-4"
          />
          <p className="text-gold mt-4 text-xs font-bold tracking-[0.25em] uppercase">
            Your Dedicated Travel Mitr
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SERVICES.map((service) => (
            <span
              key={service.label}
              className="text-foreground flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium shadow"
            >
              <span aria-hidden>{service.icon}</span>
              {service.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
