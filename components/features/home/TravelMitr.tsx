import Image from "next/image";
import { Calendar, Compass, FileText, Headset, House, Map } from "lucide-react";

const SERVICES = [
  { Icon: Compass, label: "Choose any destination" },
  { Icon: Calendar, label: "Coordinate your booking" },
  { Icon: House, label: "Comfortable stays" },
  { Icon: Map, label: "Customised itinerary" },
  { Icon: Headset, label: "Available on call" },
  { Icon: FileText, label: "Handle paperwork" },
];

/** "One person. Every step of your journey." — black→crimson band with the
 *  dedicated Travel Mitr portrait and an auto-scrolling marquee of gold
 *  outline service chips. */
export function TravelMitr() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-[#140006] via-[#57062b] to-[#a11550] py-16 text-white">
      <div className="mx-auto max-w-[1192px] px-4 text-center">
        <h2 className="font-display text-4xl font-semibold">
          One person. Every step of your journey.
        </h2>

        <div className="mt-10 flex flex-col items-center">
          <div className="relative size-[180px] overflow-hidden rounded-full ring-2 ring-white/30">
            <Image
              src="/images/home/travel-mitr.jpg"
              alt="Your dedicated Travel Mitr"
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>
          <p className="text-gold mt-5 text-xs font-bold tracking-[0.25em] uppercase">
            Your Dedicated Travel Mitr
          </p>
        </div>
      </div>

      {/* Full-bleed marquee: two copies of the chip list scroll continuously;
          pauses on hover; soft fades at the edges. */}
      <div
        className="mt-12"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max gap-4 pr-4">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 gap-4"
            >
              {SERVICES.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="border-gold/70 flex items-center gap-2.5 rounded-full border bg-white/5 px-6 py-3.5 text-[15px] font-medium whitespace-nowrap text-white"
                >
                  <Icon className="text-gold h-5 w-5" strokeWidth={1.8} />
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
