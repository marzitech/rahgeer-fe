import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* This app is a zone of marzi.life: marzi-web proxies `/holidays/*` here
     and the public URL is marzi.life/holidays/... Everything Next emits
     (routes, chunks, next/image, the rewrites below) is prefixed. Plain
     strings are not — see lib/base-path.ts. */
  basePath: "/holidays",

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
