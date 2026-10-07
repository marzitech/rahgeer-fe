"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/**
 * "Looking to travel?" — the assistance band.
 *
 * Left: a short WhatsApp-style exchange showing what asking a Travel Mitr
 * actually looks like, because "real-time assistance" means nothing until
 * you see someone booking wheelchair help. Right: the policies people ask
 * about before they commit, collapsed so they do not wall off the CTA.
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

            <ul className="mt-6 space-y-4">
              {CHAT.map((message) => (
                <li
                  key={message.text}
                  className={cn(
                    "flex items-end gap-2",
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
