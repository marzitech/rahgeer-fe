import { SectionHeading } from "@/components/ui/SectionHeading";

const FAQS = [
  {
    question: "Who is Marzi for?",
    answer:
      "Marzi is built for travellers above 50 — and for families planning comfortable, well-supported holidays for their parents.",
  },
  {
    question: "What is a Travel Mitr?",
    answer:
      "Your dedicated Relationship Manager who plans and coordinates your entire holiday.",
  },
  {
    question: "Is trip planning free?",
    answer:
      "Yes — planning your trip with a Travel Mitr is completely free. You only pay for the bookings you choose to make.",
  },
  {
    question: "Can I plan a holiday for my parents?",
    answer:
      "Absolutely. Many of our travellers are children planning trips for their parents — we keep you updated at every step.",
  },
  {
    question: "Does Marzi help with visas, forex and insurance?",
    answer:
      "Yes. Your Travel Mitr provides dedicated support for visas, forex and travel insurance as part of the planning.",
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
