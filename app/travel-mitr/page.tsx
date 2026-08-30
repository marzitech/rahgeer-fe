import type { Metadata } from "next";
import Image from "next/image";
import { FileCheck, Map, MessageCircle, Plane, Smile } from "lucide-react";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { LeadForm } from "@/components/features/home/LeadForm";
import { SparkleChip } from "@/components/features/home/SparkleChip";

export const metadata: Metadata = {
  title: "Your Travel Mitr — Marzi",
  description:
    "A real person who plans the trip with you — from your first question to your last day away. Talk to a Travel Mitr about your next holiday.",
};

const STEPS = [
  {
    Icon: MessageCircle,
    title: "Ask your questions",
    description:
      "Call, message on WhatsApp, or leave your number. Ask about the walking, the rooms, the group — anything.",
  },
  {
    Icon: Map,
    title: "Create your itinerary",
    description:
      "If nothing on the site quite fits, your Mitr builds a trip around your dates and your pace.",
  },
  {
    Icon: Plane,
    title: "Book your flights",
    description:
      "Sensible connections found, seats held while you decide, tickets sent to your phone and your email.",
  },
  {
    Icon: FileCheck,
    title: "Pre-travel support",
    description:
      "Visas, forex, insurance, what to pack and which medicines to carry — handled before you leave.",
  },
  {
    Icon: Smile,
    title: "Enjoy your trip",
    description:
      "The same person stays reachable throughout. And they call once you're home, to hear how it went.",
  },
];

/** /travel-mitr — the Mitr landing page (Figma "Travel Mitr Page"): maroon
 *  intro card + lead form up top, the five-step "What a Mitr does" walk,
 *  then the shared FAQ block. */
export default function TravelMitrPage() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24 md:pt-28">
        {/* Intro card + lead form */}
        <section className="mx-auto grid max-w-[1192px] grid-cols-1 items-stretch gap-6 px-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8a1149] to-[#a3195b] p-7 text-white md:p-8">
            <div>
              <SparkleChip label="Marzi Mitr" />
              <h1 className="font-display mt-4 text-[28px] leading-tight font-bold text-balance md:text-[34px]">
                <span className="text-gold">A real person</span> who plans the
                trip with you.
              </h1>
            </div>
            <div className="relative mt-6 min-h-[240px] flex-1 overflow-hidden rounded-2xl md:min-h-[260px]">
              <Image
                src="/images/home/travel-mitr-portrait.jpg"
                alt="Your dedicated Travel Mitr"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-top"
              />
            </div>
          </div>

          <LeadForm
            heading="Talk to a Travel Mitr"
            formName="Travel Mitr Page"
          />
        </section>

        {/* What a Mitr does */}
        <section className="mx-auto max-w-[1192px] px-4 py-16 text-center md:py-20">
          <SparkleChip label="What A Mitr Does" />
          <h2 className="font-display mt-4 text-[26px] font-bold text-balance md:text-4xl">
            From your first question to your last day away
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-5 md:gap-6">
            {STEPS.map(({ Icon, title, description }, index) => (
              <div
                key={title}
                className="w-full rounded-[24px] border border-black/5 bg-white p-6 shadow-sm sm:w-[300px] md:w-[340px]"
              >
                <span className="bg-brand mx-auto flex size-14 items-center justify-center rounded-full text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="text-foreground/50 mt-4 text-[11px] font-bold tracking-[0.2em] uppercase">
                  Step {index + 1}
                </p>
                <h3 className="font-display text-brand-darker mt-1 text-lg font-bold">
                  {title}
                </h3>
                <p className="text-foreground/65 mt-2 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Faq />
      </main>
      <Footer />
    </>
  );
}
