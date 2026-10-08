"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import type { Expert } from "@/lib/content/home-content";
import { CHAT_START, advanceChat, chatDelay, type ChatState } from "@/lib/chat-loop";

/**
 * "Bespoke Marzi Holidays" — the personalised-travel band.
 *
 * Left: a WhatsApp-style exchange showing what asking a Travel Mitr
 * actually looks like, because "planned end-to-end" means nothing until
 * you watch someone move a room to the ground floor. Right: what a
 * bespoke holiday actually covers.
 */

/**
 * The conversation that plays on a loop.
 *
 * Four exchanges rather than one, because a single question answered
 * reads as a scripted demo; a Mitr handling a wheelchair, a diet, a
 * delay and a doctor reads as the job. Every one of these is a thing the
 * desk is actually asked.
 */
const CHAT = [
  {
    from: "traveller" as const,
    text: "My wife only eats Jain food. Will that be possible?",
    time: "10:45 AM",
  },
  {
    from: "mitr" as const,
    text: "Yes, definitely. Every hotel and restaurant on your trip has the note now.",
    time: "10:46 AM",
  },
  {
    from: "traveller" as const,
    text: "Can we get a room on a lower floor? My knees aren't great.",
    time: "10:52 AM",
  },
  {
    from: "mitr" as const,
    text: "Moved your booking to the ground floor, near the lift for easy moving around.",
    time: "10:54 AM",
  },
  {
    from: "traveller" as const,
    text: "My husband isn't feeling well.",
    time: "11:18 AM",
  },
  {
    from: "mitr" as const,
    text: "A doctor will be with you in 20 minutes. I'm on my way, too.",
    time: "11:19 AM",
  },
  {
    from: "traveller" as const,
    text: "I need wheelchair assistance at Mumbai airport.",
    time: "11:40 AM",
  },
  {
    from: "mitr" as const,
    text: "Done. Wheelchair booked for your 3 pm flight to Bengaluru.",
    time: "11:41 AM",
  },
];

/**
 * What a bespoke holiday covers.
 *
 * This column used to hold the booking and cancellation policy. That
 * belongs on the tour page, beside the price someone is about to pay —
 * here, next to a conversation about what Marzi will arrange, the
 * question is what you get, not what happens if you cancel.
 */
const OFFERINGS = [
  {
    title: "Destinations of Your Choice",
    body: "Near or far, for as long as you like.",
  },
  {
    title: "Handcrafted Itineraries",
    body: "Shaped around your interests and your pace.",
  },
  {
    title: "Handpicked Stays",
    body: "Chosen for comfort, location and a restful night.",
  },
  {
    title: "End-to-end Bookings",
    body: "Flights, stays, transfers and paperwork, in one place.",
  },
  {
    title: "A Dedicated Travel Expert",
    body: "Reachable before you leave and throughout the trip.",
  },
];

/** How much of the script shows when motion is turned down. */
const STILL_MESSAGES = 4;

/**
 * The exchange, playing itself.
 *
 * The list is pinned to a fixed height and anchored at the bottom so
 * the section around it does not jump as messages arrive — a band that
 * grows and collapses on a timer drags the rest of the page with it.
 */
function ChatLoop() {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<ChatState>(CHAT_START);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(
      () => setState((s) => advanceChat(s, CHAT.length)),
      chatDelay(state),
    );
    return () => clearTimeout(id);
  }, [state, reduced]);

  const typing = !reduced && state.phase === "typing";
  const next = CHAT[Math.min(state.shown, CHAT.length - 1)];
  // Motion turned down: two complete exchanges, sitting still. Whole
  // exchanges rather than a slice of the loop — stopping on an
  // unanswered question would read as the Mitr ignoring someone, and
  // the full conversation is in the transcript below either way.
  const visible = reduced
    ? CHAT.slice(0, STILL_MESSAGES)
    : // Only the last few fit the frame, and the newest is what matters.
      CHAT.slice(Math.max(0, state.shown - 3), state.shown);

  return (
    <div
      aria-hidden
      className={cn(
        "mt-6 flex flex-col justify-end gap-4",
        // Fixed height keeps the page from jumping as messages arrive;
        // the mask fades the oldest one out at the top edge instead of
        // slicing it through the middle of a word.
        !reduced &&
          "h-[17rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_3rem)]",
      )}
    >
      {visible.map((message) => (
        <Bubble key={message.text} message={message} />
      ))}
      {typing ? <TypingDots from={next.from} /> : null}
    </div>
  );
}

function Bubble({ message }: { message: (typeof CHAT)[number] }) {
  return (
    <div
      className={cn(
        "flex items-end gap-2 motion-safe:animate-[chat-in_320ms_ease-out]",
        message.from === "mitr" && "flex-row-reverse",
      )}
    >
      {message.from === "traveller" ? (
        <Image
          src="/images/home/reviewer-vikram.jpg"
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm",
          message.from === "traveller"
            ? "rounded-bl-sm bg-brand text-white"
            : "rounded-br-sm bg-brand text-white",
        )}
      >
        <p className="leading-snug">{message.text}</p>
        <p className="mt-1 text-[0.6rem] text-white/70">{message.time}</p>
      </div>
    </div>
  );
}

function TypingDots({ from }: { from: "traveller" | "mitr" }) {
  return (
    <div className={cn("flex items-end gap-2", from === "mitr" && "flex-row-reverse")}>
      {from === "traveller" ? <span className="size-9 shrink-0" /> : null}
      <div className="bg-brand/70 flex gap-1 rounded-2xl px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-white/90 motion-safe:animate-[chat-dot_1s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Whether the viewer has asked for less movement.
 *
 * Subscribed to rather than copied into state: a media query is already
 * an external store, and mirroring it with an effect means rendering
 * once with the wrong answer and then again with the right one.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    // The server cannot know. Assuming motion is fine matches the
    // default, so the markup it sends is right for most people.
    () => false,
  );
}

export function TravelExpert({ expert }: { expert: Expert }) {
  return (
    <section className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-display text-[1.75rem] font-extrabold text-brand sm:text-4xl">
            Bespoke Marzi Holidays
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Completely personalised itineraries, planned end-to-end.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* ── The conversation, with the Mitr in front of it ──────────────
              The portrait is pinned to the card's bottom-right and layered
              over the chat, as the design has it: messages run behind him
              rather than beside him, and nothing about the chat's height
              can move him. The doodle sits under everything at 24%, so it
              reads as texture on the sand rather than a second picture. */}
          <div className="bg-cream-dark relative isolate overflow-hidden rounded-3xl">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.24]"
              style={{
                backgroundImage: "url('/images/textures/doodle-pattern.webp')",
                backgroundSize: "520px auto",
                backgroundRepeat: "repeat",
              }}
            />

            <div className="relative p-6 pr-[22%] sm:p-8 sm:pr-[20%]">
              <h3 className="font-display text-2xl leading-tight font-bold text-brand sm:text-3xl">
                A Marzi Travel Expert at your service
              </h3>

              <ChatLoop />

              {/* The loop is decoration: it shows the same two or three
                  messages at a time and rewrites itself every second or
                  so, which is unusable through a screen reader. The whole
                  conversation is here once, in order, and read instead. */}
              <ul className="sr-only">
                {CHAT.map((message) => (
                  <li key={message.text}>
                    {message.from === "traveller" ? "Traveller" : "Travel Mitr"}:{" "}
                    {message.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Same framing as the expert card: a fixed portrait ratio with
                object-cover trims the transparent margins a studio cut-out
                arrives with, and the bottom anchor keeps the subject
                standing on the card's edge. Last in the DOM, so it paints
                over the chat without a z-index. Photos come from the
                Travel Mitr roster, so swapping the person is a dashboard
                edit. The card clips, so nothing overhangs. */}
            <div className="pointer-events-none absolute right-0 bottom-0 aspect-[3/4] w-[46%] max-w-[16rem] sm:w-[42%]">
              <Image
                src={expert.photoUrl}
                alt={expert.name}
                fill
                sizes="(max-width: 640px) 56vw, (max-width: 1024px) 48vw, 272px"
                className="object-cover object-bottom"
              />
            </div>
          </div>

          {/* ── What a bespoke holiday covers ─────────────────────────── */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 lg:p-10">
            <ul className="space-y-5">
              {OFFERINGS.map((offering) => (
                <li key={offering.title} className="flex gap-3">
                  {/* A small diamond, as the design draws it. */}
                  <span
                    aria-hidden
                    className="mt-[0.4rem] size-1.5 shrink-0 rotate-45 bg-brand"
                  />
                  <div>
                    <h4 className="text-[0.7rem] font-bold tracking-[0.08em] text-ink uppercase">
                      {offering.title}
                    </h4>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-ink/60">
                      {offering.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Straight to the AI planner, not the enquiry form: this band is
                about a holiday built around you, and the planner is where
                that starts. The same CTA event is kept so the click series
                is unbroken; the destination is recorded on it. */}
            <Link
              href="/plan/ai"
              onClick={() =>
                track(EVENTS.BOOK_SELF_CTA, { section: "travel_expert", destination: "ai_planner" })
              }
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              Start Planning
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
