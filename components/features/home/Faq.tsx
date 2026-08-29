import Image from "next/image";
import { Phone, Plus } from "lucide-react";
import { SparkleChip } from "./SparkleChip";

// Design's five lead questions first; the rest keep the answers users
// actually ask about (health, meals, insurance, first trips, trust).
const FAQS = [
  {
    question: "Who is Marzi for?",
    answer:
      "People above 50 who want a comfortable, well-planned holiday — in India or abroad. We also help adult children plan trips for their parents. Every journey is shaped around your pace and comfort.",
  },
  {
    question: "What is a Travel Mitr?",
    answer:
      "Your Travel Mitr is a dedicated Relationship Manager who plans, books, and coordinates your entire holiday. One trusted person handles everything, from your first conversation until you're back home.",
  },
  {
    question: "Is trip planning free?",
    answer:
      "Yes. Speaking to your Travel Mitr and planning your holiday costs nothing. You only pay for the bookings you confirm.",
  },
  {
    question: "Can I plan a holiday for my parents?",
    answer:
      "Yes. Many families come to us to plan worry-free trips for their parents. We keep you informed through the journey, and reach out promptly in case of any emergency. So you have complete peace of mind, wherever you are.",
  },
  {
    question: "Does Marzi help with visa, forex and insurance?",
    answer:
      "Yes. Visa, travel insurance, forex, and documentation are all managed for you in one place. There are no hidden costs and no extra charge for visa processing — you always know exactly what you're paying for.",
  },
  {
    question: "What is the Pre-Travel Health Assessment?",
    answer:
      "Before you travel, we understand your health profile — medications, mobility, and any medical needs. This helps us plan a trip that is genuinely safe and comfortable for you. It's something most travel companies simply don't do.",
  },
  {
    question: "What happens if there's a medical emergency during the trip?",
    answer:
      "You're never on your own. Marzi offers 24x7 doctor-on-call support, and our Indian tour managers travel with a basic first-aid box. We also keep the nearest hospitals mapped along your route, so help is always close at hand.",
  },
  {
    question: "Will the hotels and transport be comfortable for seniors?",
    answer:
      "Yes. We choose hotels with lifts and easy access, and arrange comfortable transport with boarding assistance. Small details like walking distances and steps each day are planned around you, with a gentle, unhurried pace.",
  },
  {
    question: "Can Marzi cater to special dietary needs?",
    answer:
      "Absolutely. Whether you need diabetic, Jain, vegetarian, or low-salt meals, we plan your food around your requirements. So you never have to worry about what's on your plate, even far from home.",
  },
  {
    question: "I've never travelled abroad before. Can Marzi still help?",
    answer:
      "Of course. We guide first-time travellers gently, with a pre-trip orientation covering packing, documents, and what to expect. Your Travel Mitr is beside you from your first question to your return home.",
  },
];

/** Redesigned FAQ — cream two-column layout: heading + "Couldn't find your
 *  question?" Mitr card left, pale-yellow accordion rows right. Native
 *  <details> keeps it dependency-free + accessible. */
export function Faq() {
  return (
    <section className="bg-[#fbf5e6] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1192px] grid-cols-1 gap-10 px-4 lg:grid-cols-[370px_1fr] lg:gap-12">
        {/* Left column: heading + Mitr card */}
        <div className="flex flex-col">
          <div>
            <SparkleChip label="Good To Know" className="bg-white/80" />
            <h2 className="font-display mt-4 text-[28px] leading-tight font-bold text-balance md:text-4xl">
              Questions before you travel?
            </h2>
          </div>

          <div className="mt-10 lg:mt-auto lg:pt-10">
            <p className="text-lg font-bold">
              Couldn&apos;t find your question?
            </p>
            <div className="mt-4 rounded-[24px] bg-gradient-to-br from-[#8a1149] to-[#a3195b] p-6 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src="/images/home/travel-mitr-portrait.jpg"
                    alt="Nabeel Sarfaraz"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-base font-bold">Nabeel Sarfaraz</p>
                  <p className="text-sm text-white/80">Expert Travel Mitr</p>
                </div>
              </div>
              <a
                href="#plan-your-trip"
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-bold text-white transition hover:bg-black/85"
              >
                <Phone
                  className="h-4 w-4"
                  fill="currentColor"
                  strokeWidth={0}
                />
                Talk to a Marzi Mitr
              </a>
            </div>
          </div>
        </div>

        {/* Right column: accordion */}
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl bg-[#f3ead2] px-6 py-5 transition open:bg-white open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden
                  className="text-foreground/60 flex size-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white transition-transform group-open:rotate-45 group-open:bg-black group-open:text-white"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="text-foreground/70 mt-3 max-w-3xl pr-10 text-[15px] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
