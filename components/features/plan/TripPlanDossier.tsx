import type { Itinerary, BudgetLine } from "@/lib/api/endpoints";

/**
 * The printable Trip Plan dossier — mirrors the deprecated backend's
 * "marzi-travel-plan" PDF template, populated entirely from ai_output.
 * Rendered ONLY in print (hidden print:block wrapper in AiTripWizard);
 * the on-screen teaser never shows this.
 */

const TIME_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const AXIS_BLURBS: Record<string, string> = {
  "Pacing & Rest":
    "Daily walking, breaks, and downtime balanced for senior energy levels.",
  Accessibility:
    "Ramps, lifts, low-step entries, and reachable bathrooms vetted at every stop.",
  "Safety & Security":
    "Well-lit areas, vetted transport, and tourist-policed zones prioritised.",
  "Value for Money":
    "Per-night spend stays within your tier's cap and the comfort delivered earns the price.",
};

function inr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function sumLines(lines?: BudgetLine[]): number {
  return (lines ?? []).reduce((acc, l) => acc + l.total_inr, 0);
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand mt-6 rounded-md px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.22em] text-white uppercase">
      {children}
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="mt-2 h-1.5 rounded-full bg-black/10">
      <div
        className="h-1.5 rounded-full bg-[#2fa75f]"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

const SENIOR_FIT_STYLE: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-red-100 text-red-700",
};

export function TripPlanDossier({
  itinerary,
  monthLabel,
  departure,
  fallbackScore,
}: {
  itinerary: Itinerary;
  monthLabel: string;
  departure: string;
  fallbackScore: number;
}) {
  const output = itinerary.ai_output;
  if (!output) return null;

  const genEv = output.gen_ev;
  const score = genEv?.score ?? fallbackScore;
  const overview = output.trip_overview ?? {};
  const budget = output.budget;
  const totalCost = budget?.total_inr ?? output.total_estimated_cost_inr;
  const nights = itinerary.duration_nights;
  const aiDays = output.days ?? [];

  const axes: [string, number | undefined][] = [
    ["Pacing & Rest", genEv?.pacing_rest],
    ["Accessibility", genEv?.accessibility],
    ["Safety & Security", genEv?.safety_security],
    ["Value for Money", genEv?.value_for_money],
  ];

  const overviewRows: [string, string | undefined][] = [
    ["Trip Style", overview.trip_style],
    ["Destination", overview.destination || itinerary.destination],
    ["Return Plan", overview.return_plan],
    ["Daily Energy", overview.daily_energy],
    ["Travel Dates", overview.travel_dates || monthLabel],
    ["Starting City", overview.starting_city || departure],
    ["Health Mobility", overview.health_mobility],
    ["Non Negotiables", overview.non_negotiables],
    ["Stay Preference", overview.stay_preference],
    ["Walking Capacity", overview.walking_capacity],
    ["Transit Tolerance", overview.transit_tolerance],
    ["Traveller Profile", overview.traveller_profile],
  ];

  const budgetChips: [string, number][] = budget
    ? [
        ["Accommodation", sumLines(budget.accommodation)],
        ["Transport", sumLines(budget.transport)],
        ["Food & Dining", sumLines(budget.food_and_dining)],
        ["Activities & Entry", sumLines(budget.activities_and_entry)],
        ["Miscellaneous", sumLines(budget.miscellaneous)],
      ]
    : [];

  const packingSections: [string, string, string[] | undefined][] = [
    ["#821a52", "Essentials", output.packing_list?.essentials],
    ["#0d9488", "Clothing", output.packing_list?.clothing],
    ["#dc2626", "Medication & Health", output.packing_list?.medication_health],
    ["#b45309", "Senior Comfort", output.packing_list?.comfort_seniors],
    ["#1e293b", "Documents", output.packing_list?.documents],
    ["#d97706", "Tech & Gadgets", output.packing_list?.tech_gadgets],
  ];

  const breakdownSections: [string, BudgetLine[] | undefined][] = budget
    ? [
        ["Transport", budget.transport],
        ["Accommodation", budget.accommodation],
        ["Miscellaneous", budget.miscellaneous],
        ["Food & Dining", budget.food_and_dining],
        ["Activities & Entry", budget.activities_and_entry],
      ]
    : [];

  return (
    <div className="text-[13px] leading-relaxed [print-color-adjust:exact]">
      {/* Masthead */}
      <p className="font-display text-right text-lg font-bold italic">marzi</p>
      <div className="bg-brand mt-2 rounded-xl px-6 py-6 text-center text-white">
        <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.22em] uppercase">
          Proprietary AI Audit V2.0
        </span>
        <h1 className="mt-2.5 text-2xl font-bold tracking-[0.12em] uppercase">
          Your Trip Plan
        </h1>
      </div>

      {/* Headline cards */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-black/10 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
              Gen EV Score
            </p>
            {genEv?.label ? (
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700 uppercase">
                {genEv.label}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-3xl font-bold text-[#2fa75f]">
            {score}
            <span className="text-foreground/40 text-base font-semibold">
              /100
            </span>
          </p>
          <ScoreBar value={score} />
        </div>
        <div className="rounded-xl border border-black/10 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
              Estimated Budget
            </p>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold uppercase">
              Indicative
            </span>
          </div>
          <p className="text-brand mt-1.5 text-2xl font-bold">
            {inr(totalCost)}
          </p>
          <p className="text-foreground/60 mt-0.5 text-[11px]">
            Total for all travellers
          </p>
        </div>
        <div className="rounded-xl border border-black/10 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
              Trip Scope
            </p>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-bold uppercase">
              Paced for comfort
            </span>
          </div>
          <p className="text-brand mt-1.5 text-2xl font-bold">
            {nights} Nights · {nights + 1} Days
          </p>
          <p className="text-foreground/60 mt-0.5 text-[11px]">
            {overview.traveller_profile || "Day-by-day plan"}
          </p>
        </div>
      </div>

      {/* Axis cards */}
      {genEv ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {axes.map(([label, value]) =>
            typeof value === "number" ? (
              <div
                key={label}
                className="break-inside-avoid rounded-xl border border-t-2 border-black/10 border-t-[#2fa75f] p-3.5"
              >
                <div className="flex items-start justify-between gap-1">
                  <p className="text-foreground/70 text-[9px] font-bold tracking-[0.14em] uppercase">
                    {label}
                  </p>
                  <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-[8px] font-bold text-green-700 uppercase">
                    {value >= 85 ? "Excellent" : value >= 70 ? "Good" : "Fair"}
                  </span>
                </div>
                <p className="mt-1 text-2xl font-bold text-[#2fa75f]">
                  {value}
                  <span className="text-foreground/40 text-xs font-semibold">
                    /100
                  </span>
                </p>
                <ScoreBar value={value} />
                <p className="text-foreground/65 mt-2 text-[10px] leading-snug">
                  {AXIS_BLURBS[label]}
                </p>
              </div>
            ) : null,
          )}
        </div>
      ) : null}

      {/* Trip overview */}
      <Banner>Trip Overview</Banner>
      <table className="mt-0 w-full border-collapse text-[12px]">
        <tbody>
          {overviewRows
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <tr key={label} className="border-b border-black/5">
                <td className="text-brand w-40 bg-[#fdf5f9] px-3 py-2 font-bold">
                  {label}
                </td>
                <td className="text-foreground/80 px-3 py-2">{value}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Senior comfort & safety audit */}
      <Banner>Senior Comfort &amp; Safety Audit</Banner>
      <div className="bg-brand mt-3 break-inside-avoid rounded-xl p-5 text-white">
        <div className="flex items-start gap-5">
          <p className="shrink-0 text-4xl font-bold">
            {score}
            <span className="block text-center text-[10px] font-semibold text-white/70">
              / 100
            </span>
          </p>
          <div>
            <span className="rounded-full bg-[#f5e6c8] px-2.5 py-0.5 text-[9px] font-bold tracking-[0.18em] text-[#8a6d1d] uppercase">
              Marzi Certified
            </span>
            <p className="mt-1.5 text-xl font-bold tracking-wide uppercase">
              {genEv?.label || "Senior-Friendly"}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/90">
              Every day, hotel, transfer, and activity in this itinerary has
              been scored against <strong>50+ senior comfort parameters</strong>{" "}
              — pacing, hotel accessibility, transit safety, and
              medical-emergency proximity.
            </p>
          </div>
        </div>
      </div>
      {genEv?.summary ? (
        <div className="mt-3 break-inside-avoid rounded-xl border border-black/10 p-4">
          <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
            What this means
          </p>
          <p className="text-foreground/80 mt-1 text-[12px]">{genEv.summary}</p>
        </div>
      ) : null}

      {/* Budget summary */}
      {budget ? (
        <div className="mt-3 break-inside-avoid rounded-xl border border-black/10 bg-[#fdf5f9] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
                Estimated Trip Budget · Total
              </p>
              <p className="text-brand mt-1 text-2xl font-bold">
                {inr(budget.total_inr)}
              </p>
              <p className="text-foreground/60 text-[10px]">
                For all travellers · indicative
              </p>
            </div>
            <div className="text-right">
              <p className="text-foreground/60 text-[10px] font-bold tracking-[0.18em] uppercase">
                Per Person
              </p>
              <p className="text-brand mt-1 text-xl font-bold">
                {inr(budget.per_person_inr)}
              </p>
              <p className="text-foreground/60 text-[10px]">
                Approx · for each traveller
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {budgetChips.map(([label, value]) => (
              <div
                key={label}
                className="border-brand rounded-lg border-l-2 bg-white px-2.5 py-2"
              >
                <p className="text-foreground/60 text-[8px] font-bold tracking-[0.12em] uppercase">
                  {label}
                </p>
                <p className="text-[12px] font-bold">{inr(value)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Vetted accommodations */}
      {output.hotels?.length ? (
        <>
          <Banner>Vetted Accommodations</Banner>
          {output.hotels.map((hotel) => (
            <div
              key={hotel.name}
              className="mt-3 break-inside-avoid rounded-xl border border-black/10 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="border-brand border-l-2 pl-2.5">
                  <p className="text-brand font-bold">{hotel.name}</p>
                  <p className="text-[10px] font-bold tracking-wide uppercase">
                    {hotel.nights} nights
                  </p>
                </div>
                <div className="text-right">
                  {hotel.category ? (
                    <p className="text-brand text-[9px] font-bold tracking-wide uppercase">
                      {hotel.category}
                    </p>
                  ) : null}
                  <p className="text-brand text-sm font-bold">
                    {hotel.gen_ev_score}
                    <span className="text-foreground/45 text-[10px] font-semibold">
                      /100
                    </span>
                  </p>
                  <p className="text-brand text-[7px] font-bold tracking-wide uppercase">
                    Gen EV Score
                  </p>
                </div>
              </div>
              {hotel.why ? (
                <p className="text-foreground/75 mt-2 text-[12px]">
                  {hotel.why}
                </p>
              ) : null}
              {hotel.strengths?.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {hotel.strengths.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
              {hotel.price_per_night ? (
                <p className="mt-2.5 text-[11px]">
                  Estimated: <strong>{hotel.price_per_night} / night</strong>
                </p>
              ) : null}
            </div>
          ))}
        </>
      ) : null}

      {/* Weather forecast */}
      {output.weather?.length ? (
        <>
          <Banner>Weather Forecast</Banner>
          {output.weather.map((w) => (
            <div
              key={w.city}
              className="mt-3 break-inside-avoid rounded-xl border border-t-2 border-black/10 border-t-teal-500 p-4"
            >
              <p className="text-[10px] font-bold tracking-[0.18em] text-teal-700 uppercase">
                {w.city}
              </p>
              <p className="mt-0.5 text-[12px] font-bold">{w.summary}</p>
              <div className="mt-1.5 flex items-end gap-4">
                <p className="text-3xl font-bold text-teal-600">{w.temp}</p>
                <div className="text-foreground/70 text-[11px]">
                  <p>
                    High <strong>{w.high}</strong>
                  </p>
                  <p>
                    Low <strong>{w.low}</strong>
                  </p>
                  {w.humidity ? (
                    <p>
                      Humidity <strong>{w.humidity}</strong>
                    </p>
                  ) : null}
                </div>
              </div>
              {w.planning_note ? (
                <p className="text-foreground/70 mt-2 border-t border-black/5 pt-2 text-[11px]">
                  <strong>For seniors:</strong> {w.planning_note}
                </p>
              ) : null}
            </div>
          ))}
        </>
      ) : null}

      {/* Recommended restaurants */}
      {output.restaurants?.length ? (
        <>
          <Banner>Recommended Restaurants</Banner>
          {output.restaurants.map((r) => (
            <div
              key={r.name}
              className="mt-3 break-inside-avoid rounded-xl border border-l-4 border-black/10 border-l-orange-400 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold">{r.name}</p>
                <p className="text-[11px] font-bold text-orange-600">
                  Gen EV {r.gen_ev_score}/100
                </p>
              </div>
              <p className="text-foreground/60 mt-0.5 text-[11px]">
                {[
                  r.city && `Location: ${r.city}`,
                  r.cuisine && `Cuisine: ${r.cuisine}`,
                  r.veg_options && `Veg: ${r.veg_options}`,
                ]
                  .filter(Boolean)
                  .join("   ")}
              </p>
              {r.why ? (
                <p className="text-foreground/75 mt-1.5 text-[12px]">{r.why}</p>
              ) : null}
              {r.context ? (
                <p className="text-foreground/60 mt-1 text-[11px] italic">
                  {r.context}
                </p>
              ) : null}
            </div>
          ))}
        </>
      ) : null}

      {/* Day-wise itinerary */}
      {aiDays.length ? (
        <>
          <Banner>Day-Wise Itinerary</Banner>
          {aiDays.map((day) => (
            <div key={day.day_number} className="mt-3">
              <div className="bg-brand flex items-center justify-between gap-3 rounded-lg px-4 py-2 text-white">
                <p className="text-[13px] font-bold">
                  <span className="mr-2 rounded bg-white/15 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                    Day {day.day_number}
                  </span>
                  {day.title}
                </p>
                {day.gen_ev_score ? (
                  <p className="text-[11px] font-bold whitespace-nowrap">
                    Gen EV: {day.gen_ev_score}/100
                  </p>
                ) : null}
              </div>
              {day.blocks.map((block) => (
                <div
                  key={`${block.time_of_day}-${block.title}`}
                  className="mt-3 flex break-inside-avoid gap-4"
                >
                  <div className="w-16 shrink-0">
                    <span className="text-brand inline-block rounded-md border border-black/10 px-2 py-1 text-[10px] font-bold whitespace-nowrap">
                      {block.time ||
                        TIME_LABELS[block.time_of_day] ||
                        block.time_of_day}
                    </span>
                    {block.duration ? (
                      <p className="text-foreground/55 mt-1 text-[9px]">
                        {block.duration}
                      </p>
                    ) : null}
                  </div>
                  <div className="border-brand/30 flex-1 border-l pb-1 pl-4">
                    <p className="text-[13px] font-bold">{block.title}</p>
                    <p className="text-foreground/75 mt-1 text-[12px]">
                      {block.description}
                    </p>
                    {block.senior_note ? (
                      <p className="text-foreground/60 mt-1 text-[11px] italic">
                        {block.senior_note}
                      </p>
                    ) : null}
                    {block.transport_options?.length ? (
                      <div className="mt-2 rounded-lg border border-black/10 bg-[#fafafa] p-3">
                        <p className="text-foreground/55 text-[8px] font-bold tracking-[0.18em] uppercase">
                          How to get here
                        </p>
                        <div className="mt-1.5 space-y-1.5">
                          {block.transport_options.map((option) => (
                            <div key={option.mode} className="text-[11px]">
                              <p className="flex flex-wrap items-center gap-x-1.5 font-bold">
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
                                  className={`rounded px-1.5 py-0.5 text-[7px] font-bold tracking-wide uppercase ${
                                    SENIOR_FIT_STYLE[option.senior_friendly]
                                  }`}
                                >
                                  {option.senior_friendly} senior fit
                                </span>
                                {block.recommended_mode === option.mode ? (
                                  <span className="bg-brand rounded px-1.5 py-0.5 text-[7px] font-bold tracking-wide text-white uppercase">
                                    Recommended
                                  </span>
                                ) : null}
                              </p>
                              {option.notes ? (
                                <p className="text-foreground/65">
                                  {option.notes}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {/* Meals + stay */}
              <div className="mt-3 grid break-inside-avoid grid-cols-[1fr_180px] gap-3">
                <div className="rounded-xl border border-black/10 bg-[#fdf5f9] p-3.5">
                  <p className="text-brand text-[9px] font-bold tracking-[0.18em] uppercase">
                    • Meals
                  </p>
                  <dl className="mt-1.5 space-y-1 text-[11px]">
                    {(
                      [
                        ["Breakfast", day.meals?.breakfast],
                        ["Lunch", day.meals?.lunch],
                        ["Dinner", day.meals?.dinner],
                      ] as const
                    )
                      .filter(([, v]) => v)
                      .map(([label, value]) => (
                        <div key={label} className="flex gap-2.5">
                          <dt className="w-20 shrink-0 font-bold tracking-wide uppercase">
                            {label}
                          </dt>
                          <dd className="text-foreground/70">{value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
                <div className="rounded-xl border border-black/10 bg-[#fdf5f9] p-3.5">
                  <p className="text-brand text-[9px] font-bold tracking-[0.18em] uppercase">
                    • Stay
                  </p>
                  <p className="text-foreground/80 mt-1.5 text-[11px] font-medium">
                    {day.stay || "Not applicable"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : null}

      {/* Why we skipped these */}
      {output.rejected_options?.length ? (
        <>
          <Banner>Why We Skipped These For You</Banner>
          <p className="text-foreground/60 mt-2 text-[11px] italic">
            Based on your walking capacity and comfort preferences, our AI
            research has proactively excluded these options.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {output.rejected_options.map((option) => (
              <div
                key={option.option}
                className="break-inside-avoid rounded-xl border border-l-4 border-black/10 border-l-red-400 p-3.5"
              >
                <p className="text-[12px] font-bold">{option.option}</p>
                <p className="text-foreground/75 mt-1 text-[11px]">
                  <strong className="text-red-600">Skipped because:</strong>{" "}
                  {option.reason}
                </p>
                {option.constraint ? (
                  <p className="mt-1.5 text-[8px] font-bold tracking-wide text-red-500 uppercase">
                    {option.constraint}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : null}

      {/* Day-level Gen EV scores */}
      {aiDays.length ? (
        <>
          <Banner>Day-Level Gen EV Scores</Banner>
          <table className="mt-2 w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-brand text-white">
                <th className="px-3 py-2 text-left">Day</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Key note</th>
                <th className="px-3 py-2 text-right">Gen EV</th>
                <th className="px-3 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {aiDays.map((day) => (
                <tr key={day.day_number} className="border-b border-black/5">
                  <td className="text-brand px-3 py-2 font-bold">
                    {day.day_number}
                  </td>
                  <td className="px-3 py-2">{day.title}</td>
                  <td className="text-foreground/65 px-3 py-2">
                    {day.blocks.length} stops
                    {day.summary ? ` · ${day.summary}` : ""}
                  </td>
                  <td className="px-3 py-2 text-right font-bold">
                    {day.gen_ev_score ? `${day.gen_ev_score}/100` : "—"}
                  </td>
                  <td className="text-foreground/65 px-3 py-2">
                    {day.day_type || "Activity"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {/* Packing list */}
      {output.packing_list ? (
        <>
          <Banner>Senior-Friendly Packing List</Banner>
          <p className="text-foreground/60 mt-2 text-[11px] italic">
            Tailored to your destination, travel season, and declared health
            needs. Tick items off as you pack.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {packingSections.map(([color, label, items]) =>
              items?.length ? (
                <div
                  key={label}
                  className="break-inside-avoid rounded-xl border border-black/10 p-3.5"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase">
                    {label}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="text-foreground/75 flex gap-1.5 text-[10px] leading-snug"
                      >
                        <span
                          aria-hidden
                          className="mt-0.5 size-2 shrink-0 rounded-[3px] border border-black/30"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>
        </>
      ) : null}

      {/* Price breakdown */}
      {budget ? (
        <>
          <Banner>Estimated Price Breakdown</Banner>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-foreground/60 text-[11px] italic">
              Detailed line items per category. All amounts in Indian Rupees.
            </p>
            <p className="text-[11px] font-bold tracking-wide uppercase">
              Total <span className="text-brand">{inr(budget.total_inr)}</span>
            </p>
          </div>
          {breakdownSections.map(([label, rows]) =>
            rows?.length ? (
              <table
                key={label}
                className="mt-3 w-full border-collapse break-inside-avoid text-[11px]"
              >
                <thead>
                  <tr className="bg-brand text-white">
                    <th className="px-3 py-2 text-left">{label}</th>
                    <th className="px-3 py-2 text-right">Per person</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((line) => (
                    <tr key={line.item} className="border-b border-black/5">
                      <td className="text-foreground/80 px-3 py-2">
                        {line.item}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {inr(line.per_person_inr)}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {inr(line.total_inr)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#fdf5f9]">
                    <td className="text-brand px-3 py-2 font-bold">Subtotal</td>
                    <td className="px-3 py-2 text-right">—</td>
                    <td className="px-3 py-2 text-right font-bold">
                      {inr(sumLines(rows))}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null,
          )}
        </>
      ) : null}

      {/* Footer */}
      <div className="bg-brand mt-5 break-inside-avoid rounded-xl p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase">
              Marzi Travel Mitr
            </p>
            <p className="text-[10px] text-white/80 italic">
              Senior-First Journeys for Generation Evergreen
            </p>
            <p className="mt-1.5 text-[10px] text-white/85">
              Operating Hours: 9:00 AM – 7:00 PM | Monday to Saturday
              <br />
              Reach us at holidays@marzi.life
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-bold">Gen EV: {score}/100</p>
            <p className="text-[9px] font-bold tracking-wide text-white/85 uppercase">
              {genEv?.label || "Senior-Friendly"}
            </p>
            <p className="mt-1 text-[9px] text-white/70">
              Generated by Marzi AI
              <br />
              Template v2.0
            </p>
          </div>
        </div>
      </div>
      <p className="text-foreground/55 mt-3 text-center text-[10px] italic">
        This itinerary is an advisory recommendation designed for comfort,
        accessibility, and safety. Budget estimates are indicative. Verify hotel
        rates, attraction fees, and transport costs before travel.
      </p>
    </div>
  );
}
