import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
