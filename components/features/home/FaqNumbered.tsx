"use client";

import { useRef } from "react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import type { FaqEntry } from "@/lib/content/home-content";

/**
 * The numbered FAQ from the redesign.
 *
 * Shares its questions with the long-form `Faq` used elsewhere, so the
 * answers cannot drift apart; this one shows the first few, large and
 * numbered, as the design has them.
 *
 * Rows are native `<details>` and tracking hangs off `toggle`, not a
 * click: `toggle` is what the element actually fires (keyboard included)
 * and it reports `open`, so closing a row is not counted as engagement.
 */

const SHOWN = 4;

export function FaqNumbered({ items }: { items: FaqEntry[] }) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="bg-sand py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-3 px-4">
        {items.slice(0, SHOWN).map((faq, index) => (
          <FaqRow
            key={faq.id}
            number={index + 1}
            question={faq.question}
            answer={faq.answer}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

function FaqRow({
  number,
  question,
  answer,
  defaultOpen,
}: {
  number: number;
  question: string;
  answer: string;
  defaultOpen: boolean;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={ref}
      open={defaultOpen}
      className="group rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5 open:bg-cream-dark sm:px-7 sm:py-6"
      onToggle={() => {
        if (ref.current?.open) track(EVENTS.FAQ_DROPDOWN_CLICK, { question });
      }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4">
        <span className="font-display text-lg font-bold text-brand/50 sm:text-2xl">
          {String(number).padStart(2, "0")}
        </span>
        <span className="font-display flex-1 text-base font-bold text-ink sm:text-xl">
          {question}
        </span>
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-base leading-none text-white transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 max-w-3xl pl-[2.4rem] text-sm leading-relaxed text-ink/70 sm:pl-[3.4rem]">
        {answer}
      </p>
    </details>
  );
}
