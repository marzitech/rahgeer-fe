"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { incrementNavDepth } from "@/lib/navDepth";

/** Counts client-side route changes (skipping the initial load) so Back
 *  affordances know whether history back stays inside the site. Mounted
 *  once in the root layout. */
export function NavDepthTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    incrementNavDepth();
  }, [pathname]);

  return null;
}
