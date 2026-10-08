"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { guessTripScope } from "@/components/features/home/LeadForm";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { createEnquiry } from "@/lib/api/endpoints";
import { formatPriceInr } from "@/lib/content/trips";

/**
 * "Best price" plus a two-field callback request — the package page's
 * primary conversion point.
 *
 * Deliberately short: a name and a number. Everything else the travel
 * desk can ask on the call, and every extra field here costs leads.
 */
export function PriceCallbackCard({
  slug,
  packageName,
  priceFromInr,
  strikeThroughInr,
}: {
  slug: string;
  packageName: string;
  priceFromInr: number | null;
  /** Optional "was" price. Only shown when it is actually higher. */
  strikeThroughInr?: number | null;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

  const price = formatPriceInr(priceFromInr);
  const was =
    strikeThroughInr && priceFromInr && strikeThroughInr > priceFromInr
      ? formatPriceInr(strikeThroughInr)
      : "";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const digits = mobile.replace(/\D/g, "");
    if (!name.trim()) return setError("Please tell us your name.");
    if (digits.length !== 10) return setError("Enter a 10-digit mobile number.");

    setError(null);
    setState("submitting");
    try {
      // Same shape the other package lead uses, so these land in ops's
      // existing views and sheets rather than as a new unlabelled kind.
      await createEnquiry({
        full_name: name.trim(),
        phone: `+91${digits}`,
        destination: packageName,
        trip_scope: guessTripScope(packageName),
        message: `Callback requested: ${packageName}`,
        source: "website",
        form: "package-price-callback",
      });
      track(EVENTS.CALLBACK_REQUEST_FOOTER, { slug, form: "package_price_card" });
      setState("done");
    } catch {
      setState("idle");
      setError("That didn’t send. Please try again, or call us.");
    }
  }

  return (
    <aside className="bg-sand-deep/60 overflow-hidden rounded-3xl p-4 sm:p-5">
      <div className="bg-sand rounded-3xl p-6 sm:p-7">
        <p className="font-label text-brand text-xs font-bold tracking-[0.08em] uppercase">
          Best price
        </p>

        <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
          <p className="font-display text-brand text-4xl font-bold sm:text-[2.9rem]">
            {price || "On request"}
          </p>
          {was ? (
            <span className="text-brand/60 text-sm line-through">{was}</span>
          ) : null}
          <span className="text-sm text-gray-600">Per person</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          *Travel tickets &amp; add-ons will be charged separately
        </p>

        <hr className="my-6 border-black/10" />

        {state === "done" ? (
          <div role="status" className="py-2">
            <p className="font-display text-navy text-lg font-bold">
              Thank you — we’ll call you shortly.
            </p>
            <p className="mt-1 text-sm text-gray-600">
              A Travel Mitr will walk you through {packageName} and answer anything
              you want to ask.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-navy text-base font-semibold">Want to know more?</p>

            <label htmlFor="cb-name" className="sr-only">
              Your name
            </label>
            <input
              id="cb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="focus:border-brand mt-4 w-full rounded-2xl border border-black/15 bg-transparent px-5 py-4 text-base outline-none"
            />

            <label htmlFor="cb-mobile" className="sr-only">
              Mobile number
            </label>
            <div className="focus-within:border-brand mt-4 flex items-center rounded-2xl border border-black/15">
              <span className="border-r border-black/15 px-4 py-4 text-base text-gray-600">
                +91
              </span>
              <input
                id="cb-mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile number"
                inputMode="numeric"
                autoComplete="tel-national"
                className="w-full bg-transparent px-4 py-4 text-base outline-none"
              />
            </div>

            {error ? (
              <p role="alert" className="text-brand mt-3 text-sm">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="bg-brand-deep hover:bg-brand mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold text-white transition-colors disabled:opacity-70"
            >
              {state === "submitting" ? "Sending…" : "Request a Callback"}
              <PhoneCall className="size-5" aria-hidden />
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
