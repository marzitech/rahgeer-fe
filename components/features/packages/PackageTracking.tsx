"use client";

/**
 * PackageTracking — one event when a package page is opened.
 *
 * Rendered from the (server) package page so the page itself ships no client
 * JS for this, exactly as HomeTracking is.
 *
 * Why it exists: the package page is where somebody decides, and it emitted
 * nothing. Without it the funnel jumps from "saw a card on the home page" to
 * "submitted an enquiry" with the step that actually does the persuading
 * missing from the middle — so nobody can say which trips get looked at and
 * never enquired about.
 *
 * The SLUG travels as a property, never in the name. One
 * `travel_package_viewed` with `package: "manali-5n"` rather than a name per
 * trip — which would also mean a new event name every time the desk adds one.
 */

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics/events";
import { metaFunnel } from "@/lib/meta-pixel";

export function PackageTracking({
  slug,
  title,
  destination,
  priceFromInr,
}: {
  slug: string;
  title?: string | null;
  destination?: string | null;
  priceFromInr?: number | null;
}) {
  useEffect(() => {
    track(EVENTS.TRAVEL_PACKAGE_VIEWED, {
      package: slug,
      title: title ?? null,
      destination: destination ?? null,
      // Minor units with an explicit currency, per the taxonomy's money rule.
      price_from_paise:
        typeof priceFromInr === "number"
          ? Math.round(priceFromInr * 100)
          : null,
      currency: "INR",
    });
    // The same view, told to Meta. Rupees rather than paise: `value` is a
    // major-unit decimal on Meta's side, and sending paise would report a
    // ₹45,000 trip as ₹45 lakh and wreck every ROAS figure in the account.
    metaFunnel.viewContent({
      id: slug,
      title: title ?? null,
      priceInr: priceFromInr ?? null,
      kind: "package",
    });
    // Slug only: re-firing because a title arrived from a late fetch would
    // double-count one view.
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
