"use client";

import { useEffect, useRef, useState } from "react";

const PART1 = "One person.";
const PART2 = "Every step of your journey.";
const SPEED_MS = 55; // per character
const START_DELAY_MS = 450; // pause after "One person." before typing

/** TravelMitr heading: "One person." shows first, then "Every step of your
 *  journey." types out when the heading scrolls into view. */
export function MitrHeading() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: reveal the whole line (deferred out of the effect body
    // so it doesn't trigger a synchronous cascading render).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setTyped(PART2.length));
      return () => cancelAnimationFrame(raf);
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    let delay: ReturnType<typeof setTimeout> | undefined;
    let played = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || played) return;
        played = true;
        observer.disconnect();
        delay = setTimeout(() => {
          let i = 0;
          interval = setInterval(() => {
            i += 1;
            setTyped(i);
            if (i >= PART2.length) clearInterval(interval);
          }, SPEED_MS);
        }, START_DELAY_MS);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (delay) clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, []);

  const typing = typed > 0 && typed < PART2.length;

  return (
    <h2
      ref={ref}
      className="font-display text-[28px] font-semibold md:text-4xl"
    >
      {PART1}{" "}
      {/* Full PART2 rendered; the untyped tail is invisible so the heading
          never reflows while typing. */}
      <span>{PART2.slice(0, typed)}</span>
      {typing ? (
        <span className="text-gold ml-0.5 inline-block animate-pulse">|</span>
      ) : null}
      <span className="invisible">{PART2.slice(typed)}</span>
    </h2>
  );
}
