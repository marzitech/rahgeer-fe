"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import { CHAT_START, advanceChat, chatDelay, type ChatState } from "@/lib/chat-loop";

/**
 * "Looking to travel?" — the assistance band.
 *
 * Left: a short WhatsApp-style exchange showing what asking a Travel Mitr
 * actually looks like, because "real-time assistance" means nothing until
 * you see someone booking wheelchair help. Right: the policies people ask
 * about before they commit, collapsed so they do not wall off the CTA.
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
    text: "I need wheelchair assistance at Mumbai airport.",
    time: "10:45 AM",
  },
  {
    from: "mitr" as const,
    text: "Done. Wheelchair booked for your 3PM flight to Bangalore.",
    time: "10:46 AM",
  },
  {
    from: "traveller" as const,
    text: "My mother is diabetic — can the meals be adjusted?",
    time: "10:47 AM",
  },
  {
    from: "mitr" as const,
    text: "Noted. Low-sugar meals on both flights and at the hotel.",
    time: "10:48 AM",
  },
  {
    from: "traveller" as const,
    text: "Our flight is delayed by four hours. Will the hotel hold the room?",
    time: "11:20 AM",
  },
  {
    from: "mitr" as const,
    text: "Already called them. Late check-in confirmed, no extra charge.",
    time: "11:21 AM",
  },
  {
    from: "traveller" as const,
    text: "Is there someone we can call if she feels unwell?",
    time: "11:24 AM",
  },
  {
    from: "mitr" as const,
    text: "Our doctor is on call through the whole trip. Sending the number now.",
    time: "11:25 AM",
  },
];

const POLICIES = [
  {
    title: "Booking & payments",
    body: "Full payment confirms your booking. A partial payment shows intent but does not confirm services. Non-payment within the required timeline may lead to cancellation, and registration or booking fees may be forfeited.",
  },
  {
    title: "Cancellations & refunds",
    body: "Cancellation charges depend on how close to departure you cancel and on what the hotels and airlines have already charged us. We share the exact breakdown in writing before anything is deducted.",
  },
  {
    title: "Medical & accessibility",
    body: "Tell us about mobility needs, dietary restrictions or ongoing treatment when you book. We arrange wheelchair assistance, accessible rooms and meal adjustments, and a doctor is on call throughout the trip.",
  },
  {
    title: "Travel documents & visas",
    body: "We handle visa paperwork for international trips and tell you exactly which documents to send and by when. Passports must be valid for at least six months beyond your return date.",
  },
  {
    title: "What happens if plans change",
    body: "Weather, strikes and health can all move a plan. Your Travel Mitr rearranges transfers and stays on the ground, and you are told what changed and why before it affects your day.",
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

export function TravelExpert() {
  return (
    <>
      <section className="bg-cream-dark pt-4 pb-10 text-center sm:pt-8">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-[1.75rem] font-extrabold text-brand sm:text-4xl">
            Looking to travel?
          </h2>
          <p className="mt-2 text-sm text-ink/70">
            Get real-time assistance for every travel need.
          </p>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="bg-cream-dark px-4 py-10 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-md lg:ml-auto lg:mr-8">
            <h3 className="font-display text-2xl leading-tight font-bold text-brand sm:text-3xl">
              Talk to
              <br />
              Marzi Travel Expert
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

            {/* 3:2 rather than a short strip: at 160px tall the crop cut
                through the top of his head. */}
            <div className="relative mt-6 aspect-[3/2] w-full">
              <Image
                src="/images/home/travel-mitr-portrait.jpg"
                alt="A Marzi Travel Mitr"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="rounded-2xl object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="bg-cream-dark px-4 pt-2 pb-12 sm:px-8 lg:bg-white lg:py-14">
          <div className="mx-auto max-w-md lg:mr-auto lg:ml-8">
            <ul className="space-y-5">
              {POLICIES.map((policy) => (
                <li key={policy.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  <div>
                    <h4 className="text-[0.7rem] font-bold tracking-[0.08em] text-ink uppercase">
                      {policy.title}
                    </h4>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-ink/60">
                      {policy.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/enquiry"
              onClick={() => track(EVENTS.BOOK_SELF_CTA, { section: "travel_expert" })}
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
