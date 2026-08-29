import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { SparkleChip } from "./SparkleChip";

/** WhatsApp-style planning conversation shown inside the phone mockup. */
const CHAT: { from: "traveller" | "mitr"; text: string }[] = [
  {
    from: "traveller",
    text: "I'll need wheelchair assistance at the airport.",
  },
  { from: "mitr", text: "Sure. Which airport, and where are you flying?" },
  { from: "traveller", text: "Delhi to Bengaluru, Terminal 3." },
  {
    from: "mitr",
    text: "Got it — booking assistance now, both departure and arrival. Airlines need 48 hours' notice, so I'm doing it today.",
  },
  { from: "traveller", text: "Perfect." },
];

/** "Don't see your trip? Build a customized one." — dark plum band: Mitr
 *  portrait in concentric rings + Create a Customized Trip CTA on the left,
 *  phone mockup with a real planning chat over a travel photo on the right. */
export function AiTripPlanner() {
  return (
    <section className="overflow-hidden bg-[#42051f] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: pitch + portrait + CTA */}
        <div className="relative px-6 pt-14 pb-12 md:px-12 lg:py-16">
          {/* Concentric rings behind the portrait */}
          <div
            aria-hidden
            className="absolute -bottom-40 -left-24 size-[560px] rounded-full border border-white/10"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -left-12 size-[440px] rounded-full border border-white/10"
          />

          <div className="relative mx-auto max-w-[480px] lg:mx-0">
            <div className="text-center lg:text-left">
              <SparkleChip label="AI Trip Planner" />
            </div>
            <h2 className="font-display mt-5 text-center text-[28px] leading-tight font-bold text-balance md:text-[40px] lg:text-left">
              Don&apos;t see your trip? Build a{" "}
              <span className="text-marzi-pink italic">customized</span> one.
            </h2>

            <div className="relative mt-10 flex flex-col items-center lg:items-start">
              <div className="relative h-[280px] w-[240px] overflow-hidden rounded-t-full md:h-[320px] md:w-[280px]">
                <Image
                  src="/images/home/travel-mitr-portrait.jpg"
                  alt="Your dedicated Travel Mitr"
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
              <Link
                href="/plan/ai"
                className="relative z-[1] -mt-7 flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-black/85"
              >
                <Sparkles className="text-gold h-4 w-4" />
                Create a Customized Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Right: phone chat over a travel photo */}
        <div className="relative min-h-[460px] py-10 lg:min-h-[560px]">
          <Image
            src="/images/home/travel-with-couple.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#42051f]/35" />

          <div className="relative mx-auto w-[300px] rounded-[44px] border-[10px] border-[#17171a] bg-[#faf7f2] shadow-2xl">
            {/* Notch */}
            <div className="flex justify-center pt-2.5">
              <div className="h-5 w-24 rounded-full bg-[#17171a]" />
            </div>
            <div className="space-y-3 px-4 pt-5 pb-8">
              {CHAT.map((message) => (
                <p
                  key={message.text}
                  className={
                    message.from === "mitr"
                      ? "ml-8 rounded-2xl rounded-br-md bg-[#7a0f44] px-3.5 py-2.5 text-[13px] leading-snug text-white"
                      : "mr-8 rounded-2xl rounded-bl-md border border-black/5 bg-white px-3.5 py-2.5 text-[13px] leading-snug text-[#27010f] shadow-sm"
                  }
                >
                  {message.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
