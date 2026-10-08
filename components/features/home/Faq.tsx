import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqEntry } from "@/lib/content/home-content";
import { FaqItem } from "./FaqItem";

/**
 * FAQ accordion — rows are native <details> (see FaqItem).
 *
 * The questions are edited in the dashboard and arrive with the page's
 * content, so this renders what it is given.
 */
export function Faq({ items }: { items: FaqEntry[] }) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          align="left"
          eyebrow="Why people choose Marzi"
          title="Booking A Trip Is Easy. Travelling Comfortably Takes Thought."
        />

        <div className="mt-10 divide-y divide-black/10 rounded-2xl border border-black/10">
          {items.map((faq) => (
            <FaqItem key={faq.id} question={faq.question}>
              <p className="text-foreground/70 mt-3 max-w-3xl text-sm">
                {faq.answer}
              </p>
            </FaqItem>
          ))}
        </div>
      </div>
    </section>
  );
}
