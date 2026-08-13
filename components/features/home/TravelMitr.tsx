import Image from "next/image";
import { Calendar, Compass, FileText, Headset, House, Map } from "lucide-react";
import { MitrHeading } from "./MitrHeading";

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
        <MitrHeading />

        <div className="mt-10 flex flex-col items-center">
          <div className="relative size-[140px] overflow-hidden rounded-full ring-2 ring-white/30 md:size-[180px]">
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
        <div className="animate-marquee flex w-max gap-5">
          {/* Two identical halves (the -50% loop). Each half repeats the
              service list enough times to overflow any viewport, so the
              band is always full — no empty gap. */}
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex shrink-0 gap-5 pr-5"
            >
              {[0, 1, 2].flatMap((rep) =>
                SERVICES.map(({ Icon, label }) => (
                  <span
                    key={`${rep}-${label}`}
                    className="border-gold/70 flex items-center gap-3 rounded-full border bg-white/5 px-8 py-4 text-[17px] font-medium whitespace-nowrap text-white md:text-lg"
                  >
                    <Icon className="text-gold h-6 w-6" strokeWidth={1.8} />
                    {label}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
