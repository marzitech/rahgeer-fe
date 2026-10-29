import type { NextConfig } from "next";

import { resolveBasePath } from "./lib/base-path";

const BASE_PATH = resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  /* Mount point. Unset → "/holidays": this app is a zone of marzi.life and
     marzi-web proxies `/holidays/*` here. NEXT_PUBLIC_BASE_PATH="/" → the
     root, for the holidays.marzi.life project (kept until the mobile app
     release stops loading the subdomain in its WebView). Everything Next
     emits (routes, chunks, next/image's endpoint, the rewrites below) is
     prefixed; plain strings are not — see lib/base-path.ts, which reads the
     same variable. */
  ...(BASE_PATH ? { basePath: BASE_PATH } : {}),

  /* Trip photos and hero banners are uploaded in the admin dashboard and
     served from the Marzi media CDN, so next/image has to be told those
     hosts are allowed — without this every admin-uploaded image 400s.
     Bundled art under /public needs no entry here. */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.marzi.life" },
      { protocol: "https", hostname: "media.marzitech.in" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.s3.ap-south-1.amazonaws.com" },
    ],
  },

  /* Photon (photon.komoot.io) only allows certain origins via CORS, so the
     browser can't call it directly from our domain — destination search and
     reverse geocoding go through these same-origin proxies instead (query
     strings pass through untouched). */
  async rewrites() {
    return [
      {
        source: "/api/geocode/search",
        destination: "https://photon.komoot.io/api/",
      },
      {
        source: "/api/geocode/reverse",
        destination: "https://photon.komoot.io/reverse",
      },
    ];
  },
};

export default nextConfig;
