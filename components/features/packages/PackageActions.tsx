"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";

/**
 * "Download Brochure" and "Share Trip", under the price lists.
 *
 * The brochure is the page itself, printed: the same route the AI
 * itinerary takes for its download. Everything that is not the tour —
 * header, footer, FAQ, the floating widgets — carries `print:hidden`, so
 * what comes out is the hero, highlights, itinerary, inclusions and
 * policy on white paper. No PDF service, nothing to keep in sync with
 * the page.
 *
 * Share uses the native sheet where there is one (every phone) and
 * copies the link where there is not (most desktops), saying so on the
 * button rather than in a toast this site does not have.
 */
export function PackageActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("#")[0];
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // Dismissing the sheet rejects; that is not an error to report.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard refused (insecure context, permissions). Nothing useful
      // to do but leave the button as it was.
    }
  }

  return (
    <div className="mt-8 space-y-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="bg-brand-deep hover:bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold tracking-[0.1em] text-white uppercase transition-colors"
      >
        <Download className="size-4" aria-hidden />
        Download Brochure
      </button>
      <button
        type="button"
        onClick={share}
        aria-live="polite"
        className="border-brand-deep text-brand-deep hover:bg-brand-deep/5 flex w-full items-center justify-center gap-2 rounded-full border py-4 text-sm font-semibold tracking-[0.1em] uppercase transition-colors"
      >
        <Share2 className="size-4" aria-hidden />
        {copied ? "Link copied" : "Share Trip"}
      </button>
    </div>
  );
}
