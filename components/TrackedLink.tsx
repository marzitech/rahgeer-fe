"use client";

/**
 * A `next/link` that reports a GANGADHAR event when it is followed.
 *
 * Exists so a section can stay a Server Component and still track its CTA:
 * only this leaf ships client JS, rather than the whole section becoming
 * `"use client"` for the sake of one onClick.
 *
 * The event is queued, not awaited — the SDK batches to localStorage and
 * beacons out on pagehide, so a click that navigates away still delivers.
 */

import Link from "next/link";
import type { ComponentProps } from "react";

import { track } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  /** Canonical event name — always from `EVENTS`, never a literal. */
  event: string;
  /** Event-specific properties, if any. */
  eventProps?: Record<string, unknown>;
};

export function TrackedLink({
  event,
  eventProps,
  onClick,
  ...linkProps
}: Props) {
  return (
    <Link
      {...linkProps}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
