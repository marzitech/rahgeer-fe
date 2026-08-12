"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MapPin,
  Phone,
  Search,
  Send,
  X,
} from "lucide-react";
import {
  createItinerary,
  getItinerary,
  submitItineraryLead,
  type Itinerary,
  type ItineraryIntake,
} from "@/lib/api/endpoints";
import { streamItineraryProgress } from "@/lib/api/stream";
import { TripPlanDossier } from "@/components/features/plan/TripPlanDossier";

/** AI trip-planner wizard (design: Step 1 of 9 — destination picker).
 *  Steps 2-9 are designed but not yet shared — they render a friendly
 *  placeholder until those frames land. */

const TOTAL_STEPS = 9;

const DESTINATIONS = [
  { name: "Kerala", image: "/images/destinations/kerala.jpg" },
  { name: "Kashmir", image: "/images/destinations/kashmir.jpg" },
  { name: "Rajasthan", image: "/images/destinations/rajasthan.jpg" },
  { name: "Japan", image: "/images/destinations/japan.jpg" },
  { name: "Europe", image: "/images/destinations/europe.jpg" },
  { name: "Vietnam", image: "/images/destinations/vietnam.jpg" },
];

const DURATIONS = ["1-3 Days", "4-6 Days", "7+ Days"];

/* TODO(assets): Family + Group need their design photos exported from
   Figma — using scenery stand-ins until then. */
const TRAVEL_WITH = [
  { name: "Solo", image: "/images/home/book-yourself-solo.jpg" },
  { name: "Couple", image: "/images/home/book-parents-lake.jpg" },
  { name: "Family", image: "/images/home/review-trip-1.jpg" },
  { name: "Group", image: "/images/home/review-trip-2.jpg" },
];

const DAY_PACES = [
  {
    name: "Relaxed",
    hours: "1-3 hours daily",
    from: "#8fe0a4",
    to: "#2fa75f",
    angle: -50,
  },
  {
    name: "Balanced",
    hours: "4-6 hours daily",
    from: "#f7d08a",
    to: "#ef8f34",
    angle: 0,
  },
  {
    name: "Full Day",
    hours: "7+ hours daily",
    from: "#f9b8cd",
    to: "#e64980",
    angle: 50,
  },
];

const WALK_STRETCHES = ["Under 15 mins", "15-30 mins", "Over 30 mins"];

const EXPERIENCES = [
  { name: "Religious & Spiritual", image: "/images/home/review-trip-1.jpg" },
  { name: "Nature & Wellness", image: "/images/destinations/kerala.jpg" },
  {
    name: "Exploration & Sightseeing",
    image: "/images/destinations/rajasthan.jpg",
  },
];

/* TODO(assets): hotel-room photos per the design need a Figma export —
   scenery stand-ins until then. */
const STAY_TYPES = [
  {
    name: "Homestay",
    tier: "₹ Budget",
    blurb: "Authentic local stays with cozy, personal comfort.",
    image: "/images/destinations/vietnam.jpg",
  },
  {
    name: "Comfortable 3-Star",
    tier: "₹₹ Mid-Range",
    blurb: "Reliable stays with comfort and essential amenities.",
    image: "/images/destinations/europe.jpg",
  },
  {
    name: "Luxury 5-Star",
    tier: "₹₹₹ Luxury",
    blurb: "Premium stays with luxury and exceptional service.",
    image: "/images/destinations/japan.jpg",
  },
];

const FOOD_PREFERENCES = [
  { name: "Vegetarian", emoji: "🥗" },
  { name: "Non-vegetarian", emoji: "🍖" },
  { name: "No preference", emoji: "🍽️" },
];

const TRAVELLER_TYPES = [
  { key: "children", label: "Children", age: "Age 2-11 years" },
  { key: "adults", label: "Adults", age: "Age 18+ years" },
  { key: "seniors", label: "Seniors", age: "Age 55+ years" },
] as const;

type TravellerKey = (typeof TRAVELLER_TYPES)[number]["key"];

/* Wizard answer -> backend intake enum mappings */
const DURATION_NIGHTS: Record<string, number> = {
  "1-3 Days": 2,
  "4-6 Days": 5,
  "7+ Days": 7,
};
const GROUP_TYPE_MAP: Record<string, ItineraryIntake["group_type"]> = {
  Solo: "solo",
  Couple: "couple",
  Family: "family",
  Group: "friends",
};
const FOOD_MAP: Record<string, ItineraryIntake["food_preference"]> = {
  Vegetarian: "veg",
  "Non-vegetarian": "non_veg",
  "No preference": "any",
};
const PACE_MAP: Record<string, ItineraryIntake["pace"]> = {
  Relaxed: "relaxed",
  Balanced: "balanced",
  "Full Day": "packed",
};
const WALK_MAP: Record<string, ItineraryIntake["walking_capacity"]> = {
  "Under 15 mins": "short",
  "15-30 mins": "moderate",
  "Over 30 mins": "long",
};
const TRIP_TYPE_MAP: Record<string, ItineraryIntake["trip_type"]> = {
  "Religious & Spiritual": "sightseeing",
  "Nature & Wellness": "relaxation",
  "Exploration & Sightseeing": "sightseeing",
};
const STAY_MAP: Record<string, ItineraryIntake["accommodation"]> = {
  Homestay: "villa_homestay",
  "Comfortable 3-Star": "hotel",
  "Luxury 5-Star": "resort",
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

/** Circular Gen EV Score ring (green, per design). */
function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 34;
  return (
    <div className="relative mx-auto mt-4 size-24">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#e3efe4"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="#2fa75f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - score / 100)}`}
        />
      </svg>
      <span className="font-display absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#2fa75f]">
        {score}
      </span>
    </div>
  );
}

/* Right after generation the user only sees the TEASER (design: Frame
   2147224642): hero, day tabs, stop cards, Gen EV ring, estimated cost.
   The full Trip Plan v2 dossier (transport options, meals/stay, hotels,
   weather, restaurants, skipped options, packing, price breakdown) stays
   built but hidden until the business surface for it ships (e.g. after
   the Travel Mitr call / paid download). Flip to true to show it all. */
const SHOW_FULL_DOSSIER = false;

/** Generated-itinerary screen (design: Frame 2147224642 + Trip Plan v2
 *  dossier) — hero banner, day tabs, numbered timeline with transport
 *  options, Gen EV + cost sidebar, then hotels / weather / restaurants /
 *  skipped options / packing / price breakdown. Reused for curated sample
 *  itineraries on the Explore-destinations pages. */
export function ItineraryResult({
  itinerary,
  heroImage,
  monthLabel,
  departure,
  score,
}: {
  itinerary: Itinerary;
  heroImage: string;
  monthLabel: string;
  departure: string;
  score: number;
}) {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  /* The download gate: "Where should we send your plan?" — a lead-capture
     modal; only after the contact is saved does the print dialog open. */
  const [leadOpen, setLeadOpen] = useState(false);
  const showFull = SHOW_FULL_DOSSIER;
  const activeDay =
    itinerary.days.find((d) => d.day_number === activeDayNumber) ??
    itinerary.days[0];
  const daysToRender = activeDay ? [activeDay] : [];
  const output = itinerary.ai_output;
  const genEv = output?.gen_ev;
  const displayScore = genEv?.score ?? score;
  const totalCost =
    output?.budget?.total_inr ?? output?.total_estimated_cost_inr ?? 0;

  const AXES: [string, number | undefined][] = [
    ["Pacing & Rest", genEv?.pacing_rest],
    ["Accessibility", genEv?.accessibility],
    ["Safety & Security", genEv?.safety_security],
    ["Value for Money", genEv?.value_for_money],
  ];

  return (
    <>
      {/* Print renders ONLY the branded dossier (all AI fields), never
          this on-screen teaser */}
      {leadOpen ? (
        <LeadGateModal
          itinerary={itinerary}
          onClose={() => setLeadOpen(false)}
          onDone={() => {
            setLeadOpen(false);
            // let the modal unmount before the print snapshot is taken
            setTimeout(() => window.print(), 350);
          }}
        />
      ) : null}
      <div className="hidden print:block">
        <TripPlanDossier
          itinerary={itinerary}
          monthLabel={monthLabel}
          departure={departure}
          fallbackScore={score}
        />
      </div>
      <div className="print:hidden">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src={heroImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1160px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative p-6 py-10 md:p-10 md:py-14">
            <span className="bg-gold inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Your personalised plan is ready
            </span>
            <h1 className="font-display mt-4 text-3xl font-bold text-white md:text-[44px]">
              {output?.title ?? `Your ${itinerary.destination} trip`}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <Calendar className="h-4 w-4" />
              {monthLabel}
              {departure ? (
                <>
                  <span aria-hidden>·</span>
                  <MapPin className="h-4 w-4" />
                  From {departure}
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Your Itinerary bar + day tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm md:px-7">
          <h2 className="font-display text-2xl font-bold">Your Itinerary</h2>
          {itinerary.days.length > 1 ? (
            <div className="flex max-w-full [scrollbar-width:none] overflow-x-auto rounded-full bg-[#fdeef5] p-1 print:hidden [&::-webkit-scrollbar]:hidden">
              {itinerary.days.map((day) => (
                <button
                  key={day.day_number}
                  type="button"
                  onClick={() => setActiveDayNumber(day.day_number)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition md:px-5 ${
                    day.day_number === activeDay?.day_number
                      ? "bg-brand text-white"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Day {day.day_number}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Timeline + sidebar — stretch so the day card's bottom aligns with
            the sidebar (Gen EV + cost) for a balanced layout. */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col">
            {daysToRender.map((day) => {
              const dayBlocks = day.blocks ?? [];
              const dayExtra = output?.days?.find(
                (d) => d.day_number === day.day_number,
              );
              return (
                <div
                  key={day.day_number}
                  className="mb-4 flex flex-1 flex-col last:mb-0"
                >
                  <div className="flex-1 rounded-2xl bg-white p-5 shadow-sm md:p-7">
                    {day.title || dayExtra?.gen_ev_score ? (
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-bold">
                          Day {day.day_number}: {day.title}
                        </h3>
                        {showFull && dayExtra?.gen_ev_score ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Gen EV {dayExtra?.gen_ev_score}/100
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    {dayBlocks.map((block, index) => (
                      <div
                        key={`${block.time_of_day}-${block.title}`}
                        className="relative flex gap-4 pb-6 last:pb-0 md:gap-5"
                      >
                        {index < dayBlocks.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute top-12 bottom-0 left-[21px] border-l-2 border-dashed border-black/10"
                          />
                        ) : null}
                        <span className="bg-brand font-display relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="flex-1 rounded-xl bg-[#f6efe7] p-4 md:p-5">
                          <p className="text-brand font-bold">{block.title}</p>
                          <p className="text-foreground/60 mt-1 flex items-center gap-1.5 text-sm">
                            <Clock className="h-4 w-4" />
                            {block.time ||
                              TIME_LABELS[block.time_of_day] ||
                              block.time_of_day}
                            {block.duration ? (
                              <span className="text-foreground/45 text-xs">
                                · {block.duration}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-foreground/70 mt-2.5 text-sm leading-relaxed">
                            {block.description}
                          </p>
                          {showFull && block.senior_note ? (
                            <p className="text-foreground/55 mt-2 text-xs italic">
                              {block.senior_note}
                            </p>
                          ) : null}
                          {showFull && block.transport_options?.length ? (
                            <details className="mt-3 rounded-lg bg-white/70 px-3.5 py-2.5">
                              <summary className="text-foreground/60 cursor-pointer text-[11px] font-semibold tracking-[0.14em] uppercase select-none">
                                How to get here
                              </summary>
                              <div className="mt-2 space-y-2.5">
                                {block.transport_options.map((option) => (
                                  <div
                                    key={option.mode}
                                    className="text-[13px]"
                                  >
                                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
                                      {option.mode}
                                      {option.duration ? (
                                        <span className="text-foreground/55 font-normal">
                                          · {option.duration}
                                        </span>
                                      ) : null}
                                      {option.cost ? (
                                        <span className="text-foreground/55 font-normal">
                                          · {option.cost}
                                        </span>
                                      ) : null}
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${
                                          option.senior_friendly === "high"
                                            ? "bg-green-100 text-green-700"
                                            : option.senior_friendly ===
                                                "medium"
                                              ? "bg-amber-100 text-amber-700"
                                              : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {option.senior_friendly} senior fit
                                      </span>
                                      {block.recommended_mode ===
                                      option.mode ? (
                                        <span className="bg-brand rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide text-white uppercase">
                                          Recommended
                                        </span>
                                      ) : null}
                                    </p>
                                    {option.notes ? (
                                      <p className="text-foreground/60 mt-0.5">
                                        {option.notes}
                                      </p>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </details>
                          ) : null}
                        </div>
                      </div>
                    ))}
                    {dayBlocks.length === 0 ? (
                      <p className="text-foreground/60 py-6 text-center text-sm">
                        This day is still being planned.
                      </p>
                    ) : null}
                  </div>

                  {/* Meals + stay for this day */}
                  {showFull &&
                  (dayExtra?.meals?.breakfast ||
                    dayExtra?.meals?.lunch ||
                    dayExtra?.meals?.dinner ||
                    dayExtra?.stay) ? (
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px]">
                      <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-brand text-[11px] font-bold tracking-[0.16em] uppercase">
                          • Meals
                        </p>
                        <dl className="mt-2.5 space-y-1.5 text-sm">
                          {(
                            [
                              ["Breakfast", dayExtra?.meals?.breakfast],
                              ["Lunch", dayExtra?.meals?.lunch],
                              ["Dinner", dayExtra?.meals?.dinner],
                            ] as const
                          )
                            .filter(([, v]) => v)
                            .map(([label, value]) => (
                              <div key={label} className="flex gap-3">
                                <dt className="w-24 shrink-0 text-xs font-bold tracking-wide uppercase">
                                  {label}
                                </dt>
                                <dd className="text-foreground/70 text-[13px]">
                                  {value}
                                </dd>
                              </div>
                            ))}
                        </dl>
                      </div>
                      <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-brand text-[11px] font-bold tracking-[0.16em] uppercase">
                          • Stay
                        </p>
                        <p className="text-foreground/80 mt-2.5 text-sm font-medium">
                          {dayExtra?.stay || "Not applicable"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
            {/* Gen EV Score */}
            <div className="rounded-2xl bg-gradient-to-b from-[#e8f8ec] to-white p-6 text-center shadow-sm">
              <p className="text-foreground/60 text-xs font-semibold tracking-[0.18em] uppercase">
                Gen EV Score
              </p>
              <ScoreRing score={displayScore} />
              <p className="mt-3 text-sm font-bold tracking-wide uppercase">
                {genEv?.label ||
                  (displayScore >= 75
                    ? "Senior-friendly"
                    : displayScore >= 60
                      ? "Moderately senior-friendly"
                      : "Active pace")}
              </p>
              {showFull && genEv ? (
                <div className="mt-4 space-y-2 text-left">
                  {AXES.filter(([, v]) => typeof v === "number").map(
                    ([label, value]) => (
                      <div key={label}>
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-foreground/65">{label}</span>
                          <span className="font-bold text-[#2fa75f]">
                            {value}
                          </span>
                        </div>
                        <div className="mt-0.5 h-1 rounded-full bg-black/5">
                          <div
                            className="h-1 rounded-full bg-[#2fa75f]"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : null}
              <p className="text-foreground/60 mt-3 text-xs leading-relaxed">
                {genEv?.summary ||
                  "Gen EV Score is Marzi's senior-travel index, scored across 50+ parameters - comfort, accessibility, safety, and value for money."}
              </p>
            </div>

            {/* Estimated cost + CTAs */}
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="text-foreground/60 text-xs">Estimated cost</p>
              <p className="font-display mt-1 text-4xl font-bold">
                ₹{totalCost.toLocaleString("en-IN")}
              </p>
              {showFull && output?.budget?.per_person_inr ? (
                <p className="text-foreground/55 mt-1 text-xs">
                  ≈ ₹{output.budget.per_person_inr.toLocaleString("en-IN")} per
                  person
                </p>
              ) : null}
              <Link
                href="/#plan-your-trip"
                className="mt-5 flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white py-3 text-sm font-semibold transition hover:border-black/40 print:hidden"
              >
                <Phone className="h-4 w-4" />
                Talk to a Travel Mitr
              </Link>
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="bg-brand hover:bg-brand-deep mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition print:hidden"
              >
                <Download className="h-4 w-4" />
                Download Full Itinerary
              </button>
            </div>

            {/* Weather */}
            {showFull && output?.weather?.length ? (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-foreground/60 text-xs font-semibold tracking-[0.18em] uppercase">
                  Weather forecast
                </p>
                {output.weather.map((w) => (
                  <div key={w.city} className="mt-3">
                    <p className="text-brand text-sm font-bold">{w.city}</p>
                    <p className="mt-0.5 text-sm font-medium">{w.summary}</p>
                    <p className="font-display mt-1.5 text-3xl font-bold text-[#0d9488]">
                      {w.temp}
                    </p>
                    <p className="text-foreground/60 mt-0.5 text-xs">
                      High {w.high} · Low {w.low}
                      {w.humidity ? ` · Humidity ${w.humidity}` : ""}
                    </p>
                    {w.planning_note ? (
                      <p className="text-foreground/65 mt-2 text-xs leading-relaxed">
                        <strong>For seniors:</strong> {w.planning_note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Vetted accommodations */}
        {showFull && output?.hotels?.length ? (
          <SectionCard title="Vetted accommodations">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {output.hotels.map((hotel) => (
                <div
                  key={hotel.name}
                  className="border-brand rounded-xl border-l-4 bg-[#fdf9f4] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-brand font-bold">{hotel.name}</p>
                      <p className="text-xs font-bold tracking-wide uppercase">
                        {hotel.nights} nights
                      </p>
                    </div>
                    <div className="text-right">
                      {hotel.category ? (
                        <p className="text-brand text-[10px] font-bold tracking-wide uppercase">
                          {hotel.category}
                        </p>
                      ) : null}
                      {hotel.gen_ev_score ? (
                        <p className="text-foreground/55 text-xs">
                          <span className="text-brand font-bold">
                            {hotel.gen_ev_score}
                          </span>
                          /100 Gen EV
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {hotel.why ? (
                    <p className="text-foreground/70 mt-2 text-[13px] leading-relaxed">
                      {hotel.why}
                    </p>
                  ) : null}
                  {hotel.strengths?.length ? (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {hotel.strengths.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {hotel.price_per_night ? (
                    <p className="mt-3 text-xs">
                      Estimated:{" "}
                      <strong>{hotel.price_per_night} / night</strong>
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Recommended restaurants */}
        {showFull && output?.restaurants?.length ? (
          <SectionCard title="Recommended restaurants">
            <div className="space-y-4">
              {output.restaurants.map((r) => (
                <div
                  key={r.name}
                  className="rounded-xl border-l-4 border-orange-400 bg-[#fdf9f4] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold">{r.name}</p>
                    {r.gen_ev_score ? (
                      <p className="text-xs font-bold text-orange-600">
                        Gen EV {r.gen_ev_score}/100
                      </p>
                    ) : null}
                  </div>
                  <p className="text-foreground/60 mt-0.5 text-xs">
                    {[
                      r.city,
                      r.cuisine,
                      r.veg_options && `Veg: ${r.veg_options}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {r.why ? (
                    <p className="text-foreground/70 mt-1.5 text-[13px] leading-relaxed">
                      {r.why}
                    </p>
                  ) : null}
                  {r.context ? (
                    <p className="text-foreground/55 mt-1 text-xs italic">
                      {r.context}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Why we skipped these */}
        {showFull && output?.rejected_options?.length ? (
          <SectionCard title="Why we skipped these for you">
            <p className="text-foreground/60 -mt-1 mb-4 text-xs italic">
              Based on your preferences, our AI research proactively excluded
              these options.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {output.rejected_options.map((option) => (
                <div
                  key={option.option}
                  className="rounded-xl border-l-4 border-red-400 bg-[#fdf7f4] p-5"
                >
                  <p className="text-sm font-bold">{option.option}</p>
                  <p className="text-foreground/70 mt-1.5 text-[13px]">
                    <strong className="text-red-600">Skipped because:</strong>{" "}
                    {option.reason}
                  </p>
                  {option.constraint ? (
                    <p className="mt-2 text-[10px] font-bold tracking-wide text-red-500 uppercase">
                      {option.constraint}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Packing list */}
        {showFull && output?.packing_list ? (
          <SectionCard title="Senior-friendly packing list">
            <p className="text-foreground/60 -mt-1 mb-4 text-xs italic">
              Tailored to your destination, travel season and declared needs.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["Essentials", output.packing_list.essentials],
                  ["Clothing", output.packing_list.clothing],
                  [
                    "Medication & Health",
                    output.packing_list.medication_health,
                  ],
                  ["Senior Comfort", output.packing_list.comfort_seniors],
                  ["Documents", output.packing_list.documents],
                  ["Tech & Gadgets", output.packing_list.tech_gadgets],
                ] as const
              ).map(([label, items]) =>
                items?.length ? (
                  <div
                    key={label}
                    className="rounded-xl border border-black/10 bg-white p-5"
                  >
                    <p className="text-xs font-bold tracking-wide uppercase">
                      {label}
                    </p>
                    <ul className="mt-2.5 space-y-1.5">
                      {items.map((item) => (
                        <li
                          key={item}
                          className="text-foreground/70 flex gap-2 text-[13px]"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 size-1.5 shrink-0 rounded-full border border-black/30"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          </SectionCard>
        ) : null}

        {/* Price breakdown */}
        {showFull && output?.budget ? (
          <SectionCard title="Estimated price breakdown">
            <p className="text-foreground/60 -mt-1 mb-4 text-xs italic">
              Detailed line items per category. All amounts in Indian Rupees.
            </p>
            {(
              [
                ["Transport", output.budget.transport],
                ["Accommodation", output.budget.accommodation],
                ["Food & Dining", output.budget.food_and_dining],
                ["Activities & Entry", output.budget.activities_and_entry],
                ["Miscellaneous", output.budget.miscellaneous],
              ] as const
            ).map(([label, rows]) =>
              rows?.length ? (
                <div key={label} className="mb-5 overflow-x-auto last:mb-0">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr className="bg-brand text-white">
                        <th className="rounded-l-lg px-4 py-2.5 text-left font-semibold">
                          {label}
                        </th>
                        <th className="px-4 py-2.5 text-right font-semibold">
                          Per person
                        </th>
                        <th className="rounded-r-lg px-4 py-2.5 text-right font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((line) => (
                        <tr key={line.item} className="border-b border-black/5">
                          <td className="text-foreground/75 px-4 py-2.5">
                            {line.item}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            ₹{line.per_person_inr.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold">
                            ₹{line.total_inr.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null,
            )}
            <p className="mt-2 text-right text-sm">
              Total:{" "}
              <span className="text-brand font-display text-xl font-bold">
                ₹{totalCost.toLocaleString("en-IN")}
              </span>
            </p>
          </SectionCard>
        ) : null}

        {/* Travel tips */}
        {showFull && output?.travel_tips?.length ? (
          <SectionCard title="Travel tips">
            <ul className="space-y-2 text-sm">
              {output.travel_tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span aria-hidden className="text-brand">
                    •
                  </span>
                  <span className="text-foreground/75">{tip}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}

        <p className="text-foreground/55 mt-6 text-center text-xs">
          This itinerary is an advisory recommendation designed for comfort,
          accessibility and safety. Your Travel Mitr will call you shortly to
          fine-tune and book this trip.
        </p>
      </div>
    </>
  );
}

/** "Where should we send your plan?" — the download gate modal (design:
 *  warm gradient card, Full Name / Email / WhatsApp, black send pill).
 *  On success the contact reaches the travel desk and onDone fires the
 *  print/save-as-PDF dialog. */
function LeadGateModal({
  itinerary,
  onClose,
  onDone,
}: {
  itinerary: Itinerary;
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(
    typeof itinerary.traveler_name === "string" ? itinerary.traveler_name : "",
  );
  const [email, setEmail] = useState(
    typeof itinerary.email === "string" ? itinerary.email : "",
  );
  const [whatsapp, setWhatsapp] = useState(
    typeof itinerary.phone === "string"
      ? itinerary.phone.replace(/\D/g, "").slice(-10)
      : "",
  );
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    whatsapp?: string;
    submit?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Please enter your name.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(whatsapp))
      next.whatsapp = "Enter a valid 10-digit WhatsApp number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await submitItineraryLead(itinerary.id, {
        name: name.trim(),
        email: email.trim(),
        whatsapp,
      });
      onDone();
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  }

  const inputClasses =
    "mt-1.5 w-full rounded-xl bg-[#f1f1f1] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Where should we send your plan?"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative w-full max-w-md rounded-2xl bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_25%,#ffffff_70%,#f9d9e9_100%)] p-7 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-foreground/60 absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-display text-brand pr-8 text-2xl font-bold">
          Where should we send your plan?
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[13px] font-semibold">Full Name</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value.replace(/[^a-zA-Z\s.'-]/g, ""));
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              aria-invalid={Boolean(errors.name)}
              placeholder="e.g. Asha Rao"
              className={inputClasses}
            />
            {errors.name ? (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {errors.name}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-[13px] font-semibold">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              placeholder="you@example.com"
              className={inputClasses}
            />
            {errors.email ? (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-[13px] font-semibold">Whatsapp Number</span>
            <div className="flex gap-3">
              <span className="text-foreground/60 mt-1.5 flex items-center rounded-xl bg-[#f1f1f1] px-4 text-sm">
                +91
              </span>
              <input
                inputMode="numeric"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value.replace(/\D/g, ""));
                  setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                }}
                maxLength={10}
                aria-invalid={Boolean(errors.whatsapp)}
                className={inputClasses}
              />
            </div>
            {errors.whatsapp ? (
              <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                {errors.whatsapp}
              </p>
            ) : null}
          </label>

          {errors.submit ? (
            <p role="alert" className="text-sm text-red-600">
              {errors.submit}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send my travel itinerary"}
            <Send className="h-4 w-4" />
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-green-700">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            No spam. Your details stay private.
          </p>
        </div>
      </form>
    </div>
  );
}

/** Brand section wrapper: maroon banner header + white body card. */
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="bg-brand rounded-t-2xl px-6 py-3 text-center text-sm font-bold tracking-[0.18em] text-white uppercase">
        {title}
      </div>
      <div className="rounded-b-2xl bg-white p-5 shadow-sm md:p-7">
        {children}
      </div>
    </div>
  );
}

/** Semicircular activity gauge per the design — gradient arc with a
 *  needle that leans further right the more active the pace. */
function Gauge({
  id,
  from,
  to,
  angle,
}: {
  id: string;
  from: string;
  to: string;
  angle: number;
}) {
  return (
    <svg width="52" height="32" viewBox="0 0 52 32" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M6 27 A20 20 0 0 1 46 27"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="27"
        x2="26"
        y2="12"
        stroke="#3f3f3f"
        strokeWidth="2.5"
        strokeLinecap="round"
        transform={`rotate(${angle} 26 27)`}
      />
      <circle cx="26" cy="27" r="3" fill="#3f3f3f" />
    </svg>
  );
}

const DEPARTURE_CITIES = ["Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"];

/* Indian travel seasons per the design's chips: Monsoon (Jun-Sep),
   Pleasant (Oct-Nov), Cold & Crisp (Dec-Feb), Warm (Mar-May). */
function seasonFor(monthIndex: number): { chip: string; emoji: string } {
  if (monthIndex >= 5 && monthIndex <= 8)
    return { chip: "Monsoon", emoji: "🌧️" };
  if (monthIndex === 9 || monthIndex === 10)
    return { chip: "Pleasant", emoji: "🌤️" };
  if (monthIndex === 11 || monthIndex <= 1)
    return { chip: "Cold & Crisp", emoji: "❄️" };
  return { chip: "Warm", emoji: "☀️" };
}

/* Rolling 12 months starting from the current month. Only rendered after
   user interaction (step 2), so no SSR/hydration concern. */
function buildMonthOptions() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return {
      id: `${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`,
      label: d.toLocaleString("en-US", { month: "long" }),
      year: d.getFullYear(),
      monthNumber: d.getMonth() + 1,
      ...seasonFor(d.getMonth()),
    };
  });
}

export function AiTripWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<string | null>(null);
  const [travelMonth, setTravelMonth] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [departureQuery, setDepartureQuery] = useState("");
  const [travelWith, setTravelWith] = useState<string | null>(null);
  const [foodPreference, setFoodPreference] = useState<string | null>(null);
  const [dayPace, setDayPace] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [stayType, setStayType] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [generation, setGeneration] = useState<
    "idle" | "generating" | "failed"
  >("idle");
  const [generationStep, setGenerationStep] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [walkStretch, setWalkStretch] = useState<string | null>(null);
  const [travellers, setTravellers] = useState<Record<TravellerKey, number>>({
    children: 0,
    adults: 2,
    seniors: 0,
  });

  /* Traveller counters only apply to Family and Group trips. */
  const needsTravellerCounts =
    travelWith === "Family" || travelWith === "Group";
  const totalTravellers =
    travellers.children + travellers.adults + travellers.seniors;

  function adjustTravellers(key: TravellerKey, delta: number) {
    setTravellers((prev) => ({
      ...prev,
      [key]: Math.min(12, Math.max(0, prev[key] + delta)),
    }));
  }

  const filtered = DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const monthOptions = buildMonthOptions();

  const canContinue =
    (step === 1 && Boolean(destination)) ||
    (step === 2 && Boolean(travelMonth)) ||
    (step === 3 && Boolean(duration && departure)) ||
    (step === 4 &&
      Boolean(travelWith) &&
      (!needsTravellerCounts || totalTravellers > 0)) ||
    (step === 5 && Boolean(foodPreference)) ||
    (step === 6 && Boolean(dayPace && walkStretch)) ||
    (step === 7 && Boolean(experience)) ||
    (step === 8 && Boolean(stayType)) ||
    step === 9; // notes are optional

  /* Circular month scroll: the list is rendered three times and the view
     starts on the middle copy; whenever the scroll position drifts into an
     outer copy, jump one copy-width back — an endless loop in both
     directions with no visible seam. */
  const monthTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== 2) return;
    const el = monthTrackRef.current;
    if (el) el.scrollLeft = el.scrollWidth / 3;
  }, [step]);

  function handleMonthScroll() {
    const el = monthTrackRef.current;
    if (!el) return;
    const copyWidth = el.scrollWidth / 3;
    if (el.scrollLeft < copyWidth * 0.5) {
      el.scrollLeft += copyWidth;
    } else if (el.scrollLeft > copyWidth * 1.5) {
      el.scrollLeft -= copyWidth;
    }
  }

  function goBack() {
    if (step === 1) router.back();
    else setStep(step - 1);
  }

  /* Close any live SSE subscription when the wizard unmounts. */
  const unsubscribeRef = useRef<(() => void) | null>(null);
  useEffect(() => () => unsubscribeRef.current?.(), []);

  async function generateItinerary() {
    // Contact is captured later at the download-gate, so generation runs
    // anonymously — no name/phone collected here.
    setGeneration("generating");
    setGenerationStep("");
    try {
      const monthNumber =
        monthOptions.find((m) => m.id === travelMonth)?.monthNumber ??
        new Date().getMonth() + 1;
      const { itinerary: created } = await createItinerary({
        destination: destination ?? "",
        travel_month: monthNumber,
        duration_nights: DURATION_NIGHTS[duration ?? ""] ?? 4,
        departure_city: departure ?? "",
        group_type: GROUP_TYPE_MAP[travelWith ?? ""] ?? "solo",
        ...(needsTravellerCounts ? { pax: totalTravellers } : {}),
        food_preference: FOOD_MAP[foodPreference ?? ""] ?? "any",
        pace: PACE_MAP[dayPace ?? ""] ?? "balanced",
        walking_capacity: WALK_MAP[walkStretch ?? ""] ?? "moderate",
        trip_type: TRIP_TYPE_MAP[experience ?? ""] ?? "sightseeing",
        accommodation: STAY_MAP[stayType ?? ""] ?? "hotel",
        interests: experience ? [experience] : undefined,
        special_requests: notes.trim() || undefined,
      });
      unsubscribeRef.current = streamItineraryProgress(
        created.id,
        async (event) => {
          if (typeof event.step === "string") setGenerationStep(event.step);
          if (event.event === "completed") {
            try {
              setItinerary(await getItinerary(created.id));
              setGeneration("idle");
            } catch {
              setGeneration("failed");
            }
          } else if (event.event === "failed") {
            setGeneration("failed");
          }
        },
      );
    } catch {
      setGeneration("failed");
    }
  }

  if (itinerary) {
    /* Gen EV Score — Marzi's senior-travel index. Until the backend scores
       itineraries, derive it deterministically from the trip brief: gentler
       pace, shorter walks and comfier stays score higher. */
    const score = Math.min(
      95,
      68 +
        (dayPace === "Relaxed" ? 10 : dayPace === "Balanced" ? 6 : 2) +
        (walkStretch === "Under 15 mins" ? 4 : 6) +
        (stayType === "Luxury 5-Star"
          ? 6
          : stayType === "Comfortable 3-Star"
            ? 4
            : 2),
    );
    return (
      <ItineraryResult
        itinerary={itinerary}
        heroImage={
          DESTINATIONS.find((d) => d.name === destination)?.image ??
          "/images/home/hero-bg.jpg"
        }
        monthLabel={travelMonth ?? ""}
        departure={departure ?? ""}
        score={score}
      />
    );
  }

  return (
    <div className="rounded-[28px] bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_20%,#ffffff_80%,#f9d9e9_100%)] p-5 shadow-2xl md:p-8">
      {generation === "generating" ? (
        /* Loading screen per design — plane, headline, live SSE step */
        <div className="py-16 text-center md:py-24">
          <span aria-hidden className="text-[40px]">
            ✈️
          </span>
          <h1 className="font-display mx-auto mt-4 max-w-xs text-2xl font-bold md:text-[28px]">
            We&apos;re thoughtfully planning your trip
          </h1>
          <p className="text-foreground/50 mt-3 text-sm">
            {generationStep || "Balancing activities with rest time..."}
          </p>
        </div>
      ) : generation === "failed" ? (
        <div className="py-14 text-center md:py-20">
          <span aria-hidden className="text-[40px]">
            🛬
          </span>
          <h1 className="font-display mx-auto mt-4 max-w-sm text-2xl font-bold md:text-[28px]">
            We couldn&apos;t finish your itinerary
          </h1>
          <p className="text-foreground/60 mx-auto mt-3 max-w-sm text-sm">
            Something went wrong on our side. Give it another try, or a Travel
            Mitr can plan it with you.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setGeneration("idle")}
              className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30"
            >
              Edit my answers
            </button>
            <button
              type="button"
              onClick={generateItinerary}
              className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Step counter + 9-segment progress bar */}
          <p className="text-foreground/70 text-xs font-medium">
            Step <span className="text-brand font-bold">{step}</span> of{" "}
            {TOTAL_STEPS}
          </p>
          <div className="mt-2.5 flex gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < step ? "bg-brand" : "bg-black/10"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {generation !== "idle" ? null : step === 1 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            Where would you like to go?
          </h1>

          <div className="mt-6 flex items-center gap-3 rounded-full bg-[#ececec] px-5 py-3.5">
            <Search className="text-foreground/40 h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a destination"
              className="text-foreground placeholder:text-foreground/40 w-full bg-transparent text-sm outline-none"
            />
          </div>

          {/* Destination cards — horizontal scroll, single select */}
          <div className="mt-6 flex snap-x [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {filtered.map((d) => {
              const selected = destination === d.name;
              return (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setDestination(selected ? null : d.name)}
                  aria-pressed={selected}
                  className={`relative w-[150px] shrink-0 snap-center rounded-2xl border-2 p-2 text-center transition md:w-[170px] ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  <div className="relative h-[92px] w-full overflow-hidden rounded-xl md:h-[104px]">
                    <Image
                      src={d.image}
                      alt=""
                      fill
                      sizes="170px"
                      className="object-cover"
                    />
                  </div>
                  {selected ? (
                    <span className="bg-brand absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <p
                    className={`py-2.5 text-sm font-medium ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {d.name}
                  </p>
                </button>
              );
            })}
            {filtered.length === 0 ? (
              <p className="text-foreground/60 py-6 text-sm">
                No matches — but your Travel Mitr can plan anywhere. Try another
                spelling.
              </p>
            ) : null}
          </div>
        </>
      ) : step === 2 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            When are you planning to travel?
          </h1>

          {/* Month cards — circular horizontal scroll, single select */}
          <div
            ref={monthTrackRef}
            onScroll={handleMonthScroll}
            className="mt-6 flex [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
          >
            {[0, 1, 2].flatMap((copy) =>
              monthOptions.map((m) => {
                const selected = travelMonth === m.id;
                return (
                  <button
                    key={`${copy}-${m.id}`}
                    type="button"
                    onClick={() => setTravelMonth(selected ? null : m.id)}
                    aria-pressed={selected}
                    aria-hidden={copy !== 1}
                    tabIndex={copy === 1 ? 0 : -1}
                    className={`relative w-[124px] shrink-0 rounded-xl border-2 px-3 py-5 text-center transition md:w-[136px] ${
                      selected
                        ? "border-brand bg-[#fdeaf3]"
                        : "border-black/10 bg-white hover:border-black/25"
                    }`}
                  >
                    {selected ? (
                      <span className="bg-brand absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                        <Check className="h-3 w-3" strokeWidth={3.5} />
                      </span>
                    ) : null}
                    <span aria-hidden className="text-[34px] leading-none">
                      {m.emoji}
                    </span>
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        selected ? "text-brand" : ""
                      }`}
                    >
                      {m.label}
                    </p>
                    <p className="text-foreground/50 mt-0.5 text-xs">
                      {m.year}
                    </p>
                    <span
                      className={`mt-3 inline-block rounded-full border border-black/10 px-3 py-1 text-[10px] font-medium ${
                        selected ? "bg-white" : "bg-[#f5f5f5]"
                      }`}
                    >
                      {m.chip}
                    </span>
                  </button>
                );
              }),
            )}
          </div>
        </>
      ) : step === 3 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            What&apos;s the duration of your holiday?
          </h1>

          {/* Duration cards — radio-style circle, single select */}
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            {DURATIONS.map((d) => {
              const selected = duration === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(selected ? null : d)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 px-3 py-6 transition md:py-8 ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  {selected ? (
                    <span className="bg-brand flex size-8 items-center justify-center rounded-full text-white md:size-9">
                      <Check className="h-4 w-4" strokeWidth={3.5} />
                    </span>
                  ) : (
                    <span className="size-8 rounded-full border-2 border-black/40 md:size-9" />
                  )}
                  <span className="text-xs font-bold md:text-sm">{d}</span>
                </button>
              );
            })}
          </div>

          {/* Departure city */}
          <p className="mt-7 text-[13px] font-semibold">
            Where will you be departing from?
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-full bg-[#ececec] px-5 py-3.5">
            <Search className="text-foreground/40 h-4 w-4 shrink-0" />
            <input
              value={departureQuery}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s,.'-]/g, "");
                setDepartureQuery(value);
                setDeparture(value.trim() ? value.trim() : null);
              }}
              placeholder="Search for a city, state or country..."
              className="text-foreground placeholder:text-foreground/40 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {["Current Location", ...DEPARTURE_CITIES].map((city) => {
              const isCurrentLocation = city === "Current Location";
              const selected = departure === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setDeparture(selected ? null : city);
                    setDepartureQuery("");
                  }}
                  aria-pressed={selected}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition ${
                    selected
                      ? "border-brand text-brand bg-[#fdeaf3]"
                      : isCurrentLocation
                        ? "text-brand border-black/15 bg-white hover:border-black/30"
                        : "border-black/15 bg-white hover:border-black/30"
                  }`}
                >
                  {isCurrentLocation ? (
                    <MapPin className="h-3.5 w-3.5" />
                  ) : null}
                  {city}
                </button>
              );
            })}
          </div>
        </>
      ) : step === 4 ? (
        <>
          <h1 className="font-display mt-5 text-xl font-bold md:mt-6 md:text-[32px]">
            Who are you travelling with?
          </h1>

          {/* Travel-party cards — photo + label, single select. Compact on
              mobile so the traveller counters fit without scrolling. */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-6 md:grid-cols-4 md:gap-4">
            {TRAVEL_WITH.map((t) => {
              const selected = travelWith === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTravelWith(selected ? null : t.name)}
                  aria-pressed={selected}
                  className={`relative rounded-2xl border-2 p-2 text-center transition ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  <div className="relative h-[68px] w-full overflow-hidden rounded-xl md:h-[120px]">
                    <Image
                      src={t.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 45vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  {selected ? (
                    <span className="bg-brand absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <p
                    className={`py-1.5 text-[13px] font-semibold md:py-2.5 md:text-sm ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {t.name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Traveller counters — Family / Group only */}
          {needsTravellerCounts ? (
            <>
              <p className="mt-5 text-[13px] font-semibold md:mt-7">
                How many travellers?
              </p>
              <div className="mt-2.5 grid grid-cols-1 gap-2 md:mt-3 md:grid-cols-3 md:gap-4">
                {TRAVELLER_TYPES.map((t) => (
                  <div
                    key={t.key}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-2.5 md:px-5 md:py-4"
                  >
                    <div>
                      <p className="font-display text-[15px] font-semibold md:text-[17px]">
                        {t.label}
                      </p>
                      <p className="text-foreground/50 text-[11px] md:mt-0.5 md:text-xs">
                        {t.age}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <button
                        type="button"
                        onClick={() => adjustTravellers(t.key, -1)}
                        disabled={travellers[t.key] === 0}
                        aria-label={`Fewer ${t.label.toLowerCase()}`}
                        className="flex size-7 items-center justify-center rounded-full bg-[#f1f1f1] text-lg font-bold transition hover:bg-[#e5e5e5] disabled:opacity-40 md:size-8"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold">
                        {travellers[t.key]}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustTravellers(t.key, 1)}
                        aria-label={`More ${t.label.toLowerCase()}`}
                        className="text-brand flex size-7 items-center justify-center rounded-full bg-[#fdeaf3] text-lg font-bold transition hover:bg-[#fbd8e9] md:size-8"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : step === 5 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            What kind of food works for you?
          </h1>

          {/* Food cards — emoji + label, single select */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {FOOD_PREFERENCES.map((f) => {
              const selected = foodPreference === f.name;
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFoodPreference(selected ? null : f.name)}
                  aria-pressed={selected}
                  className={`relative flex flex-col items-center gap-2.5 rounded-2xl border-2 px-3 py-5 transition md:py-7 ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  {selected ? (
                    <span className="bg-brand absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <span aria-hidden className="text-[34px] leading-none">
                    {f.emoji}
                  </span>
                  <span
                    className={`text-xs font-semibold md:text-sm ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {f.name}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : step === 6 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            How active would you like each day to be?
          </h1>

          {/* Pace cards — gauge + label + hours, single select */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {DAY_PACES.map((p) => {
              const selected = dayPace === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setDayPace(selected ? null : p.name)}
                  aria-pressed={selected}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 transition md:py-6 ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  {selected ? (
                    <span className="bg-brand absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <Gauge
                    id={`gauge-${p.name.replace(/\s/g, "")}`}
                    from={p.from}
                    to={p.to}
                    angle={p.angle}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {p.name}
                  </span>
                  <span className="text-foreground/50 -mt-1 text-xs">
                    {p.hours}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Walking stretch chips */}
          <p className="mt-7 text-[13px] font-semibold">
            How long can you walk at a stretch{" "}
            <span aria-hidden className="text-foreground/50">
              *
            </span>
          </p>
          {/* Single row on all widths — on mobile the three chips divide
              the row width equally; content-sized from md */}
          <div className="mt-3 flex gap-1.5 md:gap-2.5">
            {WALK_STRETCHES.map((w) => {
              const selected = walkStretch === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWalkStretch(selected ? null : w)}
                  aria-pressed={selected}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-2 text-[11px] font-medium whitespace-nowrap transition md:flex-none md:gap-1.5 md:px-4 md:text-xs ${
                    selected
                      ? "border-brand text-brand bg-[#fdeaf3]"
                      : "border-black/15 bg-white hover:border-black/30"
                  }`}
                >
                  {selected ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : null}
                  {w}
                </button>
              );
            })}
          </div>
        </>
      ) : step === 7 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            What kind of experience are you looking for?
          </h1>

          {/* Experience cards — photo + label, single select */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {EXPERIENCES.map((x) => {
              const selected = experience === x.name;
              return (
                <button
                  key={x.name}
                  type="button"
                  onClick={() => setExperience(selected ? null : x.name)}
                  aria-pressed={selected}
                  className={`relative rounded-2xl border-2 p-2 text-center transition ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  <div className="relative h-[88px] w-full overflow-hidden rounded-xl md:h-[104px]">
                    <Image
                      src={x.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 90vw, 340px"
                      className="object-cover"
                    />
                  </div>
                  {selected ? (
                    <span className="bg-brand absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <p
                    className={`py-2.5 text-sm font-semibold ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {x.name}
                  </p>
                </button>
              );
            })}
          </div>
        </>
      ) : step === 8 ? (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            What kind of stay are you looking for?
          </h1>

          {/* Stay cards — photo with price-tier badge, name + blurb */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {STAY_TYPES.map((s) => {
              const selected = stayType === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStayType(selected ? null : s.name)}
                  aria-pressed={selected}
                  className={`relative rounded-2xl border-2 p-2 text-left transition ${
                    selected
                      ? "border-brand bg-[#fdeaf3]"
                      : "border-black/10 bg-white hover:border-black/25"
                  }`}
                >
                  <div className="relative h-[92px] w-full overflow-hidden rounded-xl md:h-[104px]">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 90vw, 340px"
                      className="object-cover"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold shadow-sm">
                      {s.tier}
                    </span>
                  </div>
                  {selected ? (
                    <span className="bg-brand absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full text-white shadow">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  ) : null}
                  <p
                    className={`mt-2.5 px-1 text-[15px] font-semibold ${
                      selected ? "text-brand" : ""
                    }`}
                  >
                    {s.name}
                  </p>
                  <p className="text-foreground/55 mt-0.5 px-1 pb-1.5 text-xs leading-snug">
                    {s.blurb}
                  </p>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h1 className="font-display mt-6 text-2xl font-bold md:text-[32px]">
            Anything else we should keep in mind?
          </h1>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us anything else that would help us plan better"
            rows={5}
            className="text-foreground placeholder:text-foreground/40 focus:ring-brand/30 mt-6 w-full resize-none rounded-2xl bg-[#f1f1f1] p-4 text-sm outline-none focus:ring-2"
          />
        </>
      )}

      {generation === "idle" ? (
        <div className="mt-6 flex items-center justify-between gap-3 md:mt-8 md:justify-end">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue}
              className="flex items-center gap-1.5 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            /* Final step (9): generate directly — no separate brief page */
            <button
              type="button"
              onClick={generateItinerary}
              className="flex items-center gap-1.5 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              <span aria-hidden>✨</span>
              Generate my itinerary
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
