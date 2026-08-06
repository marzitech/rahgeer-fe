"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";

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

const TRAVELLER_TYPES = [
  { key: "children", label: "Children", age: "Age 2-11 years" },
  { key: "adults", label: "Adults", age: "Age 18+ years" },
  { key: "seniors", label: "Seniors", age: "Age 55+ years" },
] as const;

type TravellerKey = (typeof TRAVELLER_TYPES)[number]["key"];

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
      (!needsTravellerCounts || totalTravellers > 0));

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

  return (
    <div className="rounded-[28px] bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_20%,#ffffff_80%,#f9d9e9_100%)] p-5 shadow-2xl md:p-8">
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

      {step === 1 ? (
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
      ) : (
        <div className="py-10 text-center md:py-14">
          <h1 className="font-display text-2xl font-bold md:text-[32px]">
            {destination} in {travelMonth} it is!
          </h1>
          <p className="text-foreground/70 mx-auto mt-3 max-w-md text-sm">
            The next steps of the AI planner are on their way. Meanwhile, a
            Travel Mitr can pick your trip up from here.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3 md:mt-8 md:justify-end">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(step + 1, TOTAL_STEPS))}
          disabled={!canContinue}
          className="flex items-center gap-1.5 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-50"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
