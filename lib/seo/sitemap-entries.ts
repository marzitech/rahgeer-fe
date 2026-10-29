import type { MetadataRoute } from "next";

import { canonicalUrl } from "@/lib/base-path";

export interface SitemapInput {
  /** Package slugs the travel backend currently serves. */
  tripSlugs: string[];
  /** Slugs of the bundled fallback packages (lib/content/packages.ts). */
  packageSlugs: string[];
  /** Slugs of the bundled destination pages (lib/content/destinations.ts). */
  destinationSlugs: string[];
}

/** Routes that always exist, regardless of backend content. */
const STATIC_ROUTES: Array<[path: string, priority: number]> = [
  ["/", 1],
  ["/plan/yourself", 0.7],
  ["/plan/parents", 0.7],
  ["/plan/ai", 0.6],
  ["/enquiry", 0.5],
];

/**
 * Pure builder behind app/sitemap.ts. Every URL is absolute and carries the
 * /holidays mount point, since this is how search engines learn the pages
 * moved off holidays.marzi.life.
 */
export function sitemapEntries(input: SitemapInput): MetadataRoute.Sitemap {
  const packages = [...new Set([...input.tripSlugs, ...input.packageSlugs])];
  return [
    ...STATIC_ROUTES.map(([path, priority]) => ({
      url: canonicalUrl(path),
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...packages.map((slug) => ({
      url: canonicalUrl(`/packages/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...input.destinationSlugs.map((slug) => ({
      url: canonicalUrl(`/destinations/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
