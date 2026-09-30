"use client";

/**
 * One FAQ row — a native `<details>`, kept native so the accordion stays
 * dependency-free and accessible.
 *
 * Tracking hangs off the `toggle` event rather than a click on the summary,
 * for two reasons: `toggle` is what the element actually fires when its state
 * changes (keyboard Enter/Space included, which a click handler would miss),
 * and it exposes `open`, so closing a row does not report as another open.
 * Counting closes would double every engagement in the dashboard.
 */

import { useRef, type ReactNode } from "react";

import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";

interface Props {
  question: string;
  children: ReactNode;
}

export function FaqItem({ question, children }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={ref}
      className="group px-6 py-5"
      onToggle={() => {
        if (ref.current?.open) track(EVENTS.FAQ_DROPDOWN_CLICK, { question });
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">
        {question}
        <span
          aria-hidden
          className="text-foreground/40 transition-transform group-open:rotate-180"
        >
          ⌄
        </span>
      </summary>
      {children}
    </details>
  );
}
