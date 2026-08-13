"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** In-page anchor scrolling that stays out of the router's way.
 *
 *  Two jobs:
 *  1. After a cross-route navigation to a `/#hash` link (e.g. a package page's
 *     "Plan your trip" → `/#plan-your-trip`), re-scroll to the target once the
 *     destination route has mounted — native hash handling can fire before the
 *     target exists.
 *  2. Smoothly scroll same-page `#hash` / `/#hash` clicks (e.g. the CTA banner),
 *     WITHOUT setting `scroll-behavior: smooth` globally — that would break the
 *     App Router's scroll-to-top on navigation. `scroll-padding-top`
 *     (globals.css) keeps every jump clear of the fixed header. */
export function HashScroll() {
  const pathname = usePathname();

  // (1) Re-scroll to the hash after the route mounts.
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        block: "start",
        behavior: smooth ? "smooth" : "auto",
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // (2) Smoothly handle clicks on same-page anchors.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey)
        return;

      const anchor = (e.target as HTMLElement).closest("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || anchor.target === "_blank") return;

      // Accept "#id" and "/#id" (only when the path is the current page).
      let id: string | null = null;
      if (href.startsWith("#")) id = href.slice(1);
      else if (href.startsWith("/#") && pathname === "/") id = href.slice(2);
      if (!id) return;

      const el = document.getElementById(decodeURIComponent(id));
      if (!el) return;

      e.preventDefault();
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      el.scrollIntoView({
        block: "start",
        behavior: smooth ? "smooth" : "auto",
      });
      history.replaceState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
