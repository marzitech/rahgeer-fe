"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtmFromUrl } from "@/lib/attribution";
import { stripLinkerParamFromUrl } from "@/lib/linker-param";

/** Persists utm_* params from the URL (72h, first-touch) so a lead
 *  submitted later still carries its campaign. Mounted once in the root
 *  layout; re-checks on every route change, no-op without utm params.
 *  Also drops GA's cross-domain `_gl` param from the address bar (see
 *  lib/linker-param.ts) — after the utm capture, so nothing is lost. */
export function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmFromUrl();
    stripLinkerParamFromUrl();
  }, [pathname]);

  return null;
}
