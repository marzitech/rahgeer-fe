"use client";

/**
 * An `<a>` that reports a direct-contact click to GANGADHAR and to Meta.
 *
 * Same reasoning as TrackedLink, which this deliberately mirrors: only this
 * leaf ships client JS, so the section around it stays a Server Component
 * instead of becoming `"use client"` for the sake of one onClick. TrackedLink
 * itself cannot be reused here — it wraps `next/link`, and these are external
 * `wa.me` / `tel:` destinations, which Link has no business routing.
 *
 * Meta's standard `Contact` event is fired alongside, so "someone opened
 * WhatsApp or dialled us" is usable as a campaign objective without anyone
 * having to configure a custom conversion first.
 */

import type { ComponentProps } from "react";

import { track } from "@/lib/analytics";
import { metaFunnel } from "@/lib/meta-pixel";

type Props = Omit<ComponentProps<"a">, "onClick"> & {
  /** Which channel the customer opened. */
  channel: "whatsapp" | "call";
  /** Where on the site they clicked, e.g. "float" — a property, never a name. */
  placement: string;
  /** Canonical GANGADHAR event name; always from `EVENTS`. Optional: a
   *  placement with no event of its own still reports Contact to Meta. */
  event?: string;
  eventProps?: Record<string, unknown>;
};

export function ContactAnchor({
  channel,
  placement,
  event,
  eventProps,
  ...anchorProps
}: Props) {
  return (
    <a
      {...anchorProps}
      onClick={() => {
        if (event) track(event, { ...eventProps, placement });
        metaFunnel.contact({ channel, placement });
      }}
    />
  );
}
