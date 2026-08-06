"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";

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

export function AiTripWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<string | null>(null);

  const filtered = DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function goBack() {
    if (step === 1) router.back();
    else setStep(step - 1);
  }

  return (
    <div className="rounded-[28px] bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_20%,#ffffff_80%,#f9d9e9_100%)] p-6 shadow-2xl md:p-8">
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
      ) : (
        <div className="py-10 text-center md:py-14">
          <h1 className="font-display text-2xl font-bold md:text-[32px]">
            {destination} it is!
          </h1>
          <p className="text-foreground/70 mx-auto mt-3 max-w-md text-sm">
            The next steps of the AI planner are on their way. Meanwhile, a
            Travel Mitr can pick your trip up from here.
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 md:justify-end">
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
          disabled={!destination || step > 1}
          className="flex items-center gap-1.5 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-50"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
