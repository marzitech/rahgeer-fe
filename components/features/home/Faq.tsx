import { SectionHeading } from "@/components/ui/SectionHeading";

const FAQS = [
  {
    question: "Who is Marzi Holidays for?",
    answer:
      "People above 50 who want a comfortable, well-planned holiday — in India or abroad. We also help adult children plan trips for their parents. Every journey is shaped around your pace and comfort.",
  },
  {
    question: "What is a Travel Mitr?",
    answer:
      "Your Travel Mitr is a dedicated Relationship Manager who plans, books, and coordinates your entire holiday. One trusted person handles everything, from your first conversation until you're back home.",
  },
  {
    question: "Is trip planning really free?",
    answer:
      "Yes. Speaking to your Travel Mitr and planning your holiday costs nothing. You only pay for the bookings you confirm.",
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
    question: "Does Marzi handle visas, forex, insurance and paperwork?",
    answer:
      "Yes. Visa, travel insurance, forex, and documentation are all managed for you in one place. There are no hidden costs and no extra charge for visa processing — you always know exactly what you're paying for.",
  },
  {
    question: "Can I plan a holiday for my parents and stay updated?",
    answer:
      "Yes. Many families come to us to plan worry-free trips for their parents. We keep you informed through the journey, and reach out promptly in case of any emergency. So you have complete peace of mind, wherever you are.",
  },
  {
    question: "I've never travelled abroad before. Can Marzi still help?",
    answer:
      "Of course. We guide first-time travellers gently, with a pre-trip orientation covering packing, documents, and what to expect. Your Travel Mitr is beside you from your first question to your return home.",
  },
  {
    question: "Do I need travel insurance, and does Marzi arrange it?",
    answer:
      "Yes, we arrange travel insurance at the best available prices. We also explain in plain language exactly what it covers — including how pre-existing conditions work — so nothing is confusing. You travel fully protected, with no fine print surprises.",
  },
  {
    question: "Why should I trust Marzi Holidays?",
    answer:
      "Marzi is backed by Primus Senior Living and built on a care-first philosophy. We're not just a travel company — we plan around your health, comfort, and safety, long before you leave. That care continues at every step of your journey.",
  },
];

/** FAQ accordion — native <details> keeps it dependency-free + accessible. */
export function Faq() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          align="left"
          eyebrow="Why people choose Marzi"
          title="Booking A Trip Is Easy. Travelling Comfortably Takes Thought."
        />

        <div className="mt-10 divide-y divide-black/10 rounded-2xl border border-black/10">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">
                {faq.question}
                <span
                  aria-hidden
                  className="text-foreground/40 transition-transform group-open:rotate-180"
                >
                  ⌄
                </span>
              </summary>
              <p className="text-foreground/70 mt-3 max-w-3xl text-sm">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
