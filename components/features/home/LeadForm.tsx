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

const inputClasses =
  "mt-2 w-full rounded-xl bg-[#f1f1f1] px-4 py-4 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-brand/30";

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

  const cardClasses =
    "rounded-[28px] bg-gradient-to-b from-white via-white to-[#fce1ef] p-7 shadow-2xl";

  if (state === "success") {
    return (
      <div id="plan-your-trip" className={`${cardClasses} text-center`}>
        <p className="font-display text-brand text-2xl font-bold">
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
    <form id="plan-your-trip" onSubmit={handleSubmit} className={cardClasses}>
      <h3 className="font-display text-brand text-[28px] font-bold">
        Plan Your Trip — Free
      </h3>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-[13px] font-semibold">
            Where would you like to go?
          </span>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Switzerland, Kerala, Bhutan"
            className={inputClasses}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-[13px] font-semibold">Travel Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%228%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23444%22%20stroke-width%3D%222%22%20fill%3D%22none%22/%3E%3C/svg%3E')] bg-[right_1rem_center] bg-no-repeat pr-9`}
            >
              <option value="">Select a month</option>
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold">Full Name</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="eg. Anita Sharma"
              className={inputClasses}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold">Mobile Number</span>
          <div className="flex gap-3">
            <span className="text-foreground/60 mt-2 flex items-center rounded-xl bg-[#f1f1f1] px-4 text-sm">
              +91
            </span>
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              className={inputClasses}
            />
          </div>
        </label>

        {state === "error" ? (
          <p className="text-sm text-red-600">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
        >
          <PhoneIcon />
          {state === "submitting" ? "Sending…" : "Talk to a Travel Mitr"}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-green-700">
          <ShieldIcon />
          No spam. Your details stay private.
        </p>
      </div>
    </form>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.5a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11 4.6-.85 8-5.75 8-11V5l-8-3Zm-1.4 14.6-3.6-3.6 1.4-1.4 2.2 2.2 5.2-5.2 1.4 1.4-6.6 6.6Z" />
    </svg>
  );
}
