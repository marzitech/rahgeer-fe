"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { createEnquiry } from "@/lib/api/endpoints";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* Lead-scoping heuristic only (ops corrects on follow-up call): common
   domestic destinations => domestic, everything else => international. */
const DOMESTIC_HINTS = [
  "india",
  "kerala",
  "kashmir",
  "rajasthan",
  "goa",
  "manali",
  "himachal",
  "uttarakhand",
  "ladakh",
  "andaman",
  "sikkim",
  "varanasi",
  "rishikesh",
];

function guessTripScope(destination: string): "domestic" | "international" {
  const lower = destination.toLowerCase();
  return DOMESTIC_HINTS.some((hint) => lower.includes(hint))
    ? "domestic"
    : "international";
}

type FormState = "idle" | "submitting" | "success" | "error";

/** "Plan Your Trip — Free" hero card → backend enquiry lead. */
export function LeadForm() {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");
    try {
      await createEnquiry({
        full_name: fullName,
        phone: mobile,
        destination,
        trip_scope: guessTripScope(destination),
        message: month ? `Preferred travel month: ${month}` : "",
        source: "website",
      });
      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof ApiError
          ? "Please check your details and try again."
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (state === "success") {
    return (
      <div
        id="plan-your-trip"
        className="rounded-2xl bg-white p-8 text-center shadow-xl"
      >
        <p className="font-display text-brand text-2xl font-semibold">
          Thank you, {fullName.split(" ")[0]}!
        </p>
        <p className="text-foreground/70 mt-3 text-sm">
          Your Travel Mitr will call you shortly to start planning your trip to{" "}
          {destination}.
        </p>
      </div>
    );
  }

  return (
    <form
      id="plan-your-trip"
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-xl"
    >
      <h3 className="font-display text-foreground text-2xl font-semibold">
        Plan Your Trip — <span className="text-brand">Free</span>
      </h3>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">
            Where would you like to go?
          </span>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Switzerland, Kerala, Bhutan"
            className="focus:border-brand focus:ring-brand/20 mt-1.5 w-full rounded-lg border border-black/15 px-4 py-3.5 text-sm outline-none focus:ring-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Travel Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="focus:border-brand mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-3.5 text-sm outline-none"
            >
              <option value="">Select a month</option>
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Full Name</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="eg. Anita Sharma"
              className="focus:border-brand focus:ring-brand/20 mt-1.5 w-full rounded-lg border border-black/15 px-4 py-3.5 text-sm outline-none focus:ring-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Mobile Number</span>
          <div className="mt-1.5 flex gap-2">
            <span className="text-foreground/70 flex items-center rounded-lg border border-black/15 px-3 text-sm">
              +91
            </span>
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              placeholder="10-digit mobile number"
              className="focus:border-brand focus:ring-brand/20 w-full rounded-lg border border-black/15 px-4 py-3.5 text-sm outline-none focus:ring-2"
            />
          </div>
        </label>

        {state === "error" ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="bg-brand hover:bg-brand-deep w-full rounded-full py-3.5 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "📞 Talk to a Travel Mitr"}
        </button>

        <p className="text-foreground/50 text-center text-xs">
          🛡 No spam. Your details stay private.
        </p>
      </div>
    </form>
  );
}
