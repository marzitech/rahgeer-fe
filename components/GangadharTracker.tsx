"use client";

/**
 * GangadharTracker — initializes the GANGADHAR SDK and fires a $pageview
 * on every route change. Mounted once in the root layout; renders nothing.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/analytics";

export function GangadharTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
