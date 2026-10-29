import type { MetadataRoute } from "next";

import { DESTINATION_CONTENT } from "@/lib/content/destinations";
import { getTrips } from "@/lib/content/fetchers";
import { PACKAGE_CONTENT } from "@/lib/content/packages";
import { sitemapEntries } from "@/lib/seo/sitemap-entries";

/**
 * GET /holidays/sitemap.xml — listed in marzi.life's robots.txt. The URL
 * building is in lib/seo/sitemap-entries.ts (tested); this file only
 * gathers the slugs. A backend outage must not break the sitemap, so the
 * bundled fallback packages still appear when getTrips() yields nothing.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trips = await getTrips().catch(() => []);
  return sitemapEntries({
    tripSlugs: trips.map((t) => t.slug),
    packageSlugs: Object.keys(PACKAGE_CONTENT),
    destinationSlugs: Object.keys(DESTINATION_CONTENT),
  });
}
