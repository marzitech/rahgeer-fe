"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { createEnquiry } from "@/lib/api/endpoints";
import { getAttribution } from "@/lib/attribution";
import {
  searchDestinations,
  type DestinationSuggestion,
} from "@/lib/geocode";

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

export function guessTripScope(
  destination: string,
): "domestic" | "international" {
  const lower = destination.toLowerCase();
  return DOMESTIC_HINTS.some((hint) => lower.includes(hint))
    ? "domestic"
    : "international";
}

type FormState = "idle" | "submitting" | "success" | "error";

type FieldName = "destination" | "fullName" | "mobile";
type FieldErrors = Partial<Record<FieldName, string>>;

/* Indian mobile numbers: 10 digits starting 6-9 (mirrors the backend's
   phonenumbers validation so users hear about mistakes before submitting). */
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s.'-]*$/;
const DESTINATION_PATTERN = /^[a-zA-Z][a-zA-Z\s,.&'-]*$/;

function validate(values: {
  destination: string;
  fullName: string;
  mobile: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const destination = values.destination.trim();
  if (!destination) {
    errors.destination = "Please tell us where you'd like to go.";
  } else if (destination.length < 2) {
    errors.destination = "That destination looks too short.";
  } else if (!DESTINATION_PATTERN.test(destination)) {
    errors.destination = "Destinations can only contain letters.";
  }

  const fullName = values.fullName.trim();
  if (!fullName) {
    errors.fullName = "Please enter your name.";
  } else if (fullName.length < 3) {
    errors.fullName = "Your name looks too short.";
  } else if (!NAME_PATTERN.test(fullName)) {
    errors.fullName = "Names can only contain letters.";
  }

  if (!values.mobile) {
    errors.mobile = "Please enter your mobile number.";
  } else if (!MOBILE_PATTERN.test(values.mobile)) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  return errors;
}

/* Maps backend (DRF) field names to our form fields so server-side
   validation errors land under the right input. */
const BACKEND_FIELD_MAP: Record<string, FieldName> = {
  destination: "destination",
  full_name: "fullName",
  phone: "mobile",
};

function backendFieldErrors(detail: unknown): FieldErrors {
  const errors: FieldErrors = {};
  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    for (const [key, value] of Object.entries(detail)) {
      const field = BACKEND_FIELD_MAP[key];
      const message = Array.isArray(value) ? value[0] : value;
      if (field && typeof message === "string") errors[field] = message;
    }
  }
  return errors;
}

const inputClasses =
  "mt-2 w-full rounded-xl bg-[#f1f1f1] px-4 py-3 md:py-4 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-brand/30";
const inputErrorClasses =
  "mt-2 w-full rounded-xl bg-[#f1f1f1] px-4 py-3 md:py-4 text-sm text-foreground placeholder:text-foreground/40 outline-none ring-2 ring-red-400 focus:ring-red-400";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

type LeadFormProps = {
  /** Card heading; default is the hero's "Plan Your Trip — Free". */
  heading?: React.ReactNode;
  /** Annotates the enquiry so ops knows who the trip is for. */
  audience?: "yourself" | "parents";
  /** Show the OR divider + AI Trip planner button (planning pages). */
  showAiPlanner?: boolean;
  /** Overrides the ops-sheet Form column value (defaults from audience). */
  formName?: string;
  /** Lead channel — "app" when the page was opened from the mobile app. */
  source?: "website" | "app";
};

/** The Marzi lead form → backend enquiry. Used by the home hero and the
 *  /plan/[audience] planning pages. */
export function LeadForm({
  heading,
  audience,
  showAiPlanner = false,
  formName,
  source = "website",
}: LeadFormProps) {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  /* Live destination suggestions (Photon geocoder) — debounced dropdown
     under the destination input; picking one fills the field. */
  const [destSuggestions, setDestSuggestions] = useState<
    DestinationSuggestion[]
  >([]);
  const [destFocused, setDestFocused] = useState(false);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    // A just-picked suggestion shouldn't immediately re-open the dropdown.
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    const q = destination.trim();
    if (q.length < 2) {
      setDestSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setDestSuggestions(
          await searchDestinations(q, { signal: controller.signal }),
        );
      } catch {
        /* Free text still submits fine without suggestions. */
        if (!controller.signal.aborted) setDestSuggestions([]);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [destination]);

  function clearFieldError(field: FieldName) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    const errors = validate({ destination, fullName, mobile });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setState("idle");
      return;
    }

    setState("submitting");
    try {
      const messageParts = [
        month ? `Preferred travel month: ${month}` : "",
        audience === "parents" ? "Booking for parents." : "",
      ].filter(Boolean);
      await createEnquiry({
        full_name: fullName.trim(),
        phone: mobile,
        destination: destination.trim(),
        trip_scope: guessTripScope(destination),
        message: messageParts.join(" "),
        source,
        // Which form converted — tracked as the Form column in the
        // ops leads Google Sheet.
        form:
          formName ??
          (audience === "yourself"
            ? "plan-yourself"
            : audience === "parents"
              ? "plan-parents"
              : "home-hero"),
        // Campaign attribution: persisted utm_* (72h first-touch) merged
        // with the live URL, plus promoter source/source_id — the backend
        // hoists standard UTMs to columns and keeps the raw dict.
        attribution: getAttribution(),
      });
      setState("success");
    } catch (error) {
      setState("error");
      if (error instanceof ApiError) {
        const serverErrors = backendFieldErrors(error.detail);
        setFieldErrors(serverErrors);
        setErrorMessage(
          Object.keys(serverErrors).length > 0
            ? ""
            : "Please check your details and try again.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  // Planning pages use the design's warm card: butter-yellow top -> white
  // -> soft pink bottom. The hero card keeps its white-top variant.
  const cardClasses = showAiPlanner
    ? "scroll-mt-24 rounded-[28px] bg-[linear-gradient(to_bottom,#fcf3d5_0%,#ffffff_22%,#ffffff_78%,#f9d9e9_100%)] p-5 md:p-7 shadow-2xl"
    : "scroll-mt-24 rounded-[28px] bg-gradient-to-b from-white via-white to-[#fce1ef] p-5 md:p-7 shadow-2xl";

  function resetForm() {
    setDestination("");
    setMonth("");
    setFullName("");
    setMobile("");
    setFieldErrors({});
    setErrorMessage("");
    setState("idle");
  }

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
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 w-full rounded-full border border-black/20 bg-white py-4 text-sm font-semibold transition hover:border-black/40"
        >
          Plan Another Trip
        </button>
      </div>
    );
  }

  return (
    <form
      id="plan-your-trip"
      onSubmit={handleSubmit}
      noValidate
      className={cardClasses}
    >
      <h3 className="font-display text-brand text-2xl font-bold md:text-[28px]">
        {heading ?? "Plan Your Trip — Free"}
      </h3>

      <div className="mt-4 space-y-3.5 md:mt-6 md:space-y-5">
        <label className="block">
          <span className="text-[13px] font-semibold">
            Where would you like to go?
          </span>
          <div className="relative">
            <input
              required
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value.replace(/[^a-zA-Z\s,.&'-]/g, ""));
                clearFieldError("destination");
              }}
              onFocus={() => setDestFocused(true)}
              onBlur={() => setDestFocused(false)}
              aria-invalid={Boolean(fieldErrors.destination)}
              aria-describedby="destination-error"
              autoComplete="off"
              placeholder="e.g. Switzerland, Kerala, Bhutan"
              className={
                fieldErrors.destination ? inputErrorClasses : inputClasses
              }
            />
            {destFocused && destSuggestions.length > 0 ? (
              <div className="absolute top-full right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                {destSuggestions.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    /* onMouseDown so the pick lands before the input blurs */
                    onMouseDown={(e) => {
                      e.preventDefault();
                      skipSearchRef.current = true;
                      setDestination(s.value);
                      setDestSuggestions([]);
                      clearFieldError("destination");
                    }}
                    className="flex w-full items-center gap-2.5 border-b border-black/5 px-4 py-3 text-left text-sm font-normal transition last:border-b-0 hover:bg-black/[0.03]"
                  >
                    <MapPin className="text-foreground/40 h-4 w-4 shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <FieldError
            id="destination-error"
            message={fieldErrors.destination}
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
              onChange={(e) => {
                setFullName(e.target.value.replace(/[^a-zA-Z\s.'-]/g, ""));
                clearFieldError("fullName");
              }}
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-describedby="full-name-error"
              placeholder="eg. Anita Sharma"
              className={
                fieldErrors.fullName ? inputErrorClasses : inputClasses
              }
            />
            <FieldError id="full-name-error" message={fieldErrors.fullName} />
          </label>
        </div>

        <label className="block">
          <span className="text-[13px] font-semibold">Phone Number</span>
          <div className="flex gap-3">
            <span className="text-foreground/60 mt-2 flex items-center rounded-xl bg-[#f1f1f1] px-4 text-sm">
              +91
            </span>
            <input
              required
              inputMode="numeric"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ""));
                clearFieldError("mobile");
              }}
              maxLength={10}
              aria-invalid={Boolean(fieldErrors.mobile)}
              aria-describedby="mobile-error"
              placeholder="10-digit mobile number"
              className={fieldErrors.mobile ? inputErrorClasses : inputClasses}
            />
          </div>
          <FieldError id="mobile-error" message={fieldErrors.mobile} />
        </label>

        {state === "error" && errorMessage ? (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60 md:py-4"
        >
          {/* Parents page CTA per design: "Request a Free Plan ›" */}
          {audience === "parents" ? (
            <>
              {state === "submitting" ? "Sending…" : "Request a Free Plan"}
              <ArrowRightIcon />
            </>
          ) : (
            <>
              <PhoneIcon />
              {state === "submitting" ? "Sending…" : "Talk to a Travel Mitr"}
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-green-700">
          <ShieldIcon />
          No spam. Your details stay private.
        </p>

        {showAiPlanner ? (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-foreground/40 text-xs font-medium">OR</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>
            <Link
              href="/plan/ai"
              className="text-foreground flex w-full items-center justify-center gap-2 rounded-full border border-black/20 bg-white py-4 text-sm font-semibold transition hover:border-black/40"
            >
              <span aria-hidden>✨</span>
              Plan Trip using AI Trip planner
            </Link>
          </>
        ) : null}
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

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
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
