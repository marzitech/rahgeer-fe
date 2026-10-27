"use client";

/**
 * MetaPixel — loads the pixel and fires a PageView per route.
 *
 * Mounted once in the root layout. Renders nothing but the <noscript> beacon.
 *
 * The hostname gate is deliberately evaluated in the BROWSER, not from an env
 * var: Vercel preview builds run with the production environment, so a
 * build-time flag would have every preview deploy reporting into the live
 * dataset. The real hostname is the only thing that cannot be got wrong.
 */

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useSyncExternalStore } from "react";

import {
  captureFbclid,
  ensureMetaPixel,
  isPixelHostname,
  META_PIXEL_ID,
  trackMetaPixel,
} from "@/lib/meta-pixel";

// The hostname never changes for the life of the page, so there is nothing to
// subscribe to; useSyncExternalStore is used purely for its server/client
// snapshot split, which is what keeps this out of the server render.
const subscribeNoop = () => () => {};

function PixelPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Before the PageView: a click id that is only in the URL is gone the
    // moment the customer navigates, and it is what attributes the eventual
    // enquiry back to the ad.
    captureFbclid();
    ensureMetaPixel();
    trackMetaPixel("PageView");
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  const onLiveSite = useSyncExternalStore(
    subscribeNoop,
    () => isPixelHostname(window.location.hostname),
    () => false,
  );

  if (!onLiveSite || !META_PIXEL_ID) return null;

  return (
    <>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* useSearchParams() opts the subtree into client rendering. */}
      <Suspense fallback={null}>
        <PixelPageViews />
      </Suspense>
    </>
  );
}
