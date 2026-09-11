"use client";

/**
 * CallbackPopup — timed "Want us to call you?" card, ported from
 * marzi-web's components/CallbackPopup.tsx. Appears 5s after the visitor
 * lands on a browsing page (home, destinations, itineraries, packages);
 * skipped on the dedicated lead-form pages (/enquiry, /plan) where it
 * would compete with the main form.
 *
 * Shows once per page VISIT — every navigation to (or reload of) an
 * eligible page starts a fresh 5s timer; dismissing it only silences it
 * until the next page. A successful submit suppresses it for the rest of
 * the SESSION (sessionStorage) — a new session sees it again.
 *
 * Phone-only lead → backend enquiry endpoint (same ops sheet as the
 * main lead form). `full_name` is required by the backend, so it goes
 * in as "Callback Request" with form="callback-popup" marking the row.
 *
 * Hand-rolled modal (fixed overlay, Escape/backdrop close) like
 * DownloadAppModal — this project has no Radix dialog primitives.
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Loader2, Phone, ShieldCheck, X } from "lucide-react";
import { createEnquiry } from "@/lib/api/endpoints";
import { getAttribution } from "@/lib/attribution";

const SUBMITTED_KEY = "marzi_callback_popup_submitted";
const SHOW_DELAY_MS = 5_000;

// Prefix-matched (covers detail pages, e.g. /destinations/[slug]).
const ELIGIBLE_PREFIXES = ["/destinations", "/itineraries", "/packages"];

function isEligible(pathname: string): boolean {
  if (pathname === "/") return true;
  return ELIGIBLE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function CallbackPopup() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer restarts on navigation, so "stays on page for 5s" means 5s on
  // a single eligible page — and each navigation is a fresh chance to
  // show. Only a submit earlier in this session suppresses it.
  useEffect(() => {
    if (!isEligible(pathname)) return;
    const hasSubmitted = () => {
      try {
        return Boolean(sessionStorage.getItem(SUBMITTED_KEY));
      } catch {
        return false;
      }
    };
    if (hasSubmitted()) return;
    const timer = setTimeout(() => {
      if (hasSubmitted()) return;
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Lock body scroll + close on Escape while open (DownloadAppModal
  // pattern).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createEnquiry({
        // Backend requires a non-empty name; the form column identifies
        // these rows so ops knows the name is a placeholder.
        full_name: "Callback Request",
        phone: mobile,
        message: "Requested a callback via the timed popup.",
        source: "website",
        form: "callback-popup",
        attribution: getAttribution(),
      });
      try {
        sessionStorage.setItem(SUBMITTED_KEY, "1");
      } catch {
        // Best-effort — worst case the popup shows again on another page.
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Want us to call you?"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-white via-white to-[#fce1ef] p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full bg-black/5 text-gray-500 transition hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600">
                <Check className="h-6 w-6 text-white" strokeWidth={3} />
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-marzi-pink">
              Callback requested
            </h2>
            <p className="text-sm text-gray-700">
              Thanks! We&apos;ve received your details. Our team will contact
              you shortly.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Got It
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display mb-6 text-2xl font-bold text-marzi-pink">
              Want us to call you?
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="callback-phone"
                  className="text-sm font-semibold text-gray-900"
                >
                  Phone Number
                </label>
                <div className="flex gap-2.5">
                  <span className="flex items-center rounded-lg bg-gray-100 px-3.5 text-sm font-medium text-gray-500">
                    +91
                  </span>
                  <input
                    id="callback-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setError(null);
                    }}
                    disabled={loading}
                    className="h-12 w-full rounded-lg bg-gray-100 px-4 text-base outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>
                {error ? (
                  <p role="alert" className="text-xs font-medium text-red-600">
                    {error}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    Request a Callback
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-green-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                No spam. Your details stay private.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
