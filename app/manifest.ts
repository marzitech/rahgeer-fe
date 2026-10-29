import type { MetadataRoute } from "next";

/** PWA manifest — makes the site installable and, once added to the home
 *  screen, launch in standalone (no browser chrome) so mobile feels like a
 *  native app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marzi Travel",
    short_name: "Marzi",
    description:
      "India's first dedicated travel platform for people above 50 — from planning to booking.",
    start_url: "/",
    display: "standalone",
    background_color: "#2e1065",
    theme_color: "#2e1065",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
