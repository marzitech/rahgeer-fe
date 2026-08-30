"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BedDouble,
  Calendar,
  Check,
  CircleCheck,
  Clock,
  Footprints,
  MapPin,
  Phone,
  Plane,
  Thermometer,
  X,
} from "lucide-react";
import { BackLink } from "@/components/BackLink";
import { SparkleChip } from "@/components/features/home/SparkleChip";
import { guessTripScope } from "@/components/features/home/LeadForm";
import { ApiError } from "@/lib/api/client";
import { createEnquiry } from "@/lib/api/endpoints";
import type { PackageContent } from "@/lib/content/packages";

/** "Talk to a Travel Mitr" popup for a curated package — the lead-gate
 *  modal's warm card, trimmed to just Name + Mobile (never prefilled).
 *  Submits a website enquiry tagged with the package so ops knows which
 *  trip to call about. */
function TalkToMitrModal({
  pkg,
  onClose,
}: {
  pkg: PackageContent;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    submit?: string;
  }>({});
  const [state, setState] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(mobile))
      next.mobile = "Enter a valid 10-digit mobile number.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState("submitting");
    try {
      await createEnquiry({
        full_name: name.trim(),
        phone: mobile,
        destination: pkg.name,
        trip_scope: guessTripScope(pkg.name),
        message: `Package enquiry: ${pkg.title} (${pkg.datesLabel})`,
        source: "website",
        form: "package-talk-to-mitr",
      });
      setState("success");
    } catch (error) {
      setState("idle");
      setErrors({
        submit:
          error instanceof ApiError
            ? "Please check your details and try again."
            : "Something went wrong. Please try again.",
      });
    }
  }

  const inputClasses =
    "mt-1.5 w-full rounded-xl bg-[#f1f1f1] px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Talk to a Travel Mitr"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_25%,#ffffff_70%,#f9d9e9_100%)] p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-foreground/60 absolute top-4 right-4 flex size-7 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        {state === "success" ? (
          <div className="py-6 text-center">
            <p className="font-display text-brand text-2xl font-bold">
              Thank you, {name.trim().split(" ")[0]}!
            </p>
            <p className="text-foreground/70 mt-3 text-sm">
              Your Travel Mitr will call you shortly about the {pkg.name}{" "}
              tour.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="font-display text-brand pr-8 text-2xl font-bold">
              Talk to a Travel Mitr
            </h2>
            <p className="text-foreground/60 mt-1.5 text-sm">
              Share your details and we&apos;ll call you about the {pkg.name}{" "}
              tour.
            </p>

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
                  <p
                    role="alert"
                    className="mt-1 text-xs font-medium text-red-600"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="text-[13px] font-semibold">
                  Mobile Number
                </span>
                <div className="flex gap-3">
                  <span className="text-foreground/60 mt-1.5 flex items-center rounded-xl bg-[#f1f1f1] px-4 text-sm">
                    +91
                  </span>
                  <input
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, ""));
                      setErrors((prev) => ({ ...prev, mobile: undefined }));
                    }}
                    maxLength={10}
                    aria-invalid={Boolean(errors.mobile)}
                    placeholder="10-digit mobile number"
                    className={inputClasses}
                  />
                </div>
                {errors.mobile ? (
                  <p
                    role="alert"
                    className="mt-1 text-xs font-medium text-red-600"
                  >
                    {errors.mobile}
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
                disabled={state === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
              >
                <Phone className="h-4 w-4" />
                {state === "submitting" ? "Sending…" : "Request a call back"}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-green-700">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                No spam. Your details stay private.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const DIAL_RADIUS = 50;
const DIAL_LENGTH = Math.PI * DIAL_RADIUS;

/** Large semicircular "Senior Friendly" dial on the green gradient card
 *  (per the redesigned destination page). */
function SeniorFriendlyCard({ score }: { score: number }) {
  return (
    <div className="rounded-[24px] bg-gradient-to-b from-[#e9f7ec] to-white p-6 text-center shadow-sm">
      <div className="relative mx-auto h-[64px] w-[120px]">
        <svg viewBox="0 0 120 64" className="absolute inset-0 size-full">
          <path
            d="M10 60 A50 50 0 0 1 110 60"
            fill="none"
            stroke="#dcebdd"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M10 60 A50 50 0 0 1 110 60"
            fill="none"
            stroke="#2fa75f"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={DIAL_LENGTH}
            strokeDashoffset={DIAL_LENGTH * (1 - score / 100)}
          />
        </svg>
        <span className="text-foreground absolute inset-x-0 bottom-0 text-3xl leading-none font-bold">
          {score}
          <span className="align-top text-sm">%</span>
        </span>
      </div>
      <p className="font-display mt-2.5 text-xl font-bold">Senior Friendly</p>
      <p className="text-foreground/60 mt-1.5 text-xs leading-relaxed">
        Scored across 50+ parameters — comfort, accessibility, safety, and
        value for money.
      </p>
    </div>
  );
}

/** Redesigned curated-package detail page (Figma "Destination Page (With
 *  Trip)"): hero card + dial/info sidebar, About, Highlights, Places to
 *  Visit, Where you'll Stay, day-tabbed itinerary timeline, then the
 *  existing Why Tour and price includes/excludes cards. */
export function PackageDetail({ pkg }: { pkg: PackageContent }) {
  const [activeDay, setActiveDay] = useState(pkg.days[0]?.day ?? 1);
  const [mitrOpen, setMitrOpen] = useState(false);
  const day = pkg.days.find((d) => d.day === activeDay) ?? pkg.days[0];

  const infoRows = [
    { Icon: Clock, label: "Ideal Trip Duration", value: pkg.durationLabel },
    { Icon: Thermometer, label: "Temperature", value: pkg.tempLabel },
    { Icon: Footprints, label: "Trip Pace", value: pkg.paceLabel },
    { Icon: Plane, label: "Near Airport", value: pkg.nearAirport },
  ].filter((row) => row.value);

  return (
    <main className="bg-[#fdf7f2] pt-20 md:pt-24">
      {mitrOpen ? (
        <TalkToMitrModal pkg={pkg} onClose={() => setMitrOpen(false)} />
      ) : null}
      <div className="mx-auto max-w-[1192px] px-4 py-8">
        <BackLink
          href="/#group-tours"
          className="text-brand inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          <span aria-hidden>←</span> Back to trips
        </BackLink>

        <div className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
          {/* Hero card */}
          <div className="relative overflow-hidden rounded-[24px] lg:col-start-1">
            <Image
              src={pkg.image}
              alt={pkg.name}
              width={1160}
              height={420}
              className="h-[240px] w-full object-cover md:h-[320px]"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <SparkleChip label="Group Tour" />
              <h1 className="font-display mt-3 text-[28px] leading-tight font-bold text-balance text-white md:text-[40px]">
                {pkg.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-white/90">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {pkg.datesLabel}
                </span>
                {pkg.fromCity ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    From {pkg.fromCity}
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          {/* Sidebar: dial, trip facts, price — before the content on mobile */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <SeniorFriendlyCard score={pkg.genEvScore} />

            {infoRows.length > 0 ? (
              <div className="space-y-4 rounded-[24px] bg-white p-5 shadow-sm">
                {infoRows.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <span className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-full text-white">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground/55 text-[11px]">{label}</p>
                      <p className="text-sm font-bold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="rounded-[24px] bg-white p-6 text-center shadow-sm">
              <p className="text-foreground/60 text-xs">Starting From</p>
              <p className="font-display mt-1 text-4xl font-bold">
                ₹{pkg.priceFromInr.toLocaleString("en-IN")}
              </p>
              <p className="text-foreground/60 mt-2 text-xs">
                {pkg.packageType} · {pkg.mealsLabel}
              </p>
              <button
                type="button"
                onClick={() => setMitrOpen(true)}
                className="bg-brand hover:bg-brand-deep mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition"
              >
                <Phone className="h-4 w-4" />
                Talk to a Travel Mitr
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="space-y-6 lg:col-start-1">
            {/* About */}
            {pkg.about ? (
              <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
                <h2 className="font-display text-xl font-bold">
                  About {pkg.name}
                </h2>
                <p className="text-foreground/70 mt-3 text-sm leading-relaxed md:text-[15px]">
                  {pkg.about}
                </p>
              </section>
            ) : null}

            {/* Highlights */}
            <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl font-bold">Highlights</h2>
              <ul className="mt-4 space-y-3">
                {pkg.highlights.map((h) => (
                  <li key={h.term} className="flex gap-2.5 text-sm">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">
                      <strong className="text-foreground font-semibold">
                        {h.term}
                      </strong>{" "}
                      – {h.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Places to visit */}
            {pkg.placesToVisit?.length ? (
              <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
                <h2 className="font-display text-xl font-bold">
                  Place to Visit in {pkg.name}
                </h2>
                <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {pkg.placesToVisit.map((place) => (
                    <div
                      key={place.name}
                      className="relative aspect-[4/5] w-[200px] shrink-0 snap-start overflow-hidden rounded-2xl md:w-[220px]"
                    >
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3.5 pt-14">
                        <p className="font-display text-lg font-semibold text-white">
                          {place.name}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/85">
                          {place.blurb}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Where you'll stay */}
            {pkg.stays?.length ? (
              <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
                <h2 className="font-display text-xl font-bold">
                  Where you&apos;ll Stay
                </h2>
                <div className="mt-4 space-y-2.5">
                  {pkg.stays.map((stay) => (
                    <div
                      key={`${stay.city}-${stay.name}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#fdf0f5] px-4 py-3"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="bg-brand flex size-8 shrink-0 items-center justify-center rounded-lg text-white">
                          <BedDouble className="h-4 w-4" />
                        </span>
                        <span className="truncate text-sm font-bold">
                          {stay.name}
                        </span>
                      </span>
                      <span className="text-foreground/60 shrink-0 text-xs font-medium">
                        {stay.city} · {stay.nights}{" "}
                        {stay.nights === 1 ? "Night" : "Nights"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Your Itinerary */}
            <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl font-bold">Your Itinerary</h2>
              {pkg.days.length > 1 ? (
                <div className="mt-4 flex max-w-full gap-1.5 overflow-x-auto rounded-full bg-[#fdeef5] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {pkg.days.map((d) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setActiveDay(d.day)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                        d.day === day?.day
                          ? "bg-brand text-white"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      Day {d.day}
                    </button>
                  ))}
                </div>
              ) : null}

              {day ? (
                <>
                  <p className="text-foreground/60 mt-4 text-sm font-semibold">
                    Day {day.day}: {day.title}
                  </p>
                  <div className="mt-4">
                    {day.stops.map((stop, index) => (
                      <div
                        key={stop.title}
                        className="relative flex gap-4 pb-5 last:pb-0"
                      >
                        {index < day.stops.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute top-11 bottom-0 left-[19px] border-l-2 border-dashed border-black/10"
                          />
                        ) : null}
                        <span className="bg-brand font-display relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="flex-1 rounded-2xl bg-[#fdf0f5] p-4">
                          <p className="text-brand font-bold">{stop.title}</p>
                          <p className="text-foreground/60 mt-0.5 flex items-center gap-1.5 text-sm">
                            <Clock className="h-3.5 w-3.5" />
                            {stop.time}
                          </p>
                          <p className="text-foreground/70 mt-1.5 text-sm leading-relaxed">
                            {stop.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </section>

            {/* Why Tour With Marzi */}
            <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-xl font-bold">
                Why Tour With Marzi?
              </h2>
              <ul className="mt-4 space-y-2.5">
                {pkg.whyTourWithMarzi.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tour price includes / excludes */}
            <section className="rounded-[24px] bg-white p-6 shadow-sm md:p-7">
              <h2 className="font-display text-lg font-bold text-green-700">
                Tour price includes
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.priceIncludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
              <h2 className="font-display mt-6 text-lg font-bold text-red-600">
                Tour price excludes
              </h2>
              <ul className="mt-3 space-y-2">
                {pkg.priceExcludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span className="text-foreground/75">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
