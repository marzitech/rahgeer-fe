"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtmFromUrl } from "@/lib/attribution";

/** Persists utm_* params from the URL (72h, first-touch) so a lead
 *  submitted later still carries its campaign. Mounted once in the root
 *  layout; re-checks on every route change, no-op without utm params. */
export function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmFromUrl();
  }, [pathname]);

  return null;
}
