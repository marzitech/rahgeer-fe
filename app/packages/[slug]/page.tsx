import { notFound } from "next/navigation";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { PackageDetail } from "@/components/features/packages/PackageDetail";
import { PackageHero } from "@/components/features/packages/PackageHero";
import { PriceCallbackCard } from "@/components/features/packages/PriceCallbackCard";
import { getTrip, getTrips } from "@/lib/content/fetchers";
import { normalizePackageDetail } from "@/lib/content/package-detail";
import { PACKAGE_CONTENT } from "@/lib/content/packages";

/**
 * Curated package page.
 *
 * Content comes from the travel backend, so the desk edits a trip in the
 * dashboard and the page follows within the revalidate window. The
 * bundled `PACKAGE_CONTENT` stays as a fallback for the original eight
 * tours: if the backend is unreachable the page still renders rather
 * than 404ing a trip we know exists.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  const trips = await getTrips();
  const slugs = new Set([
    ...trips.map((t) => t.slug),
    ...Object.keys(PACKAGE_CONTENT),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function PackagePage({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;

  const pkg = normalizePackageDetail(await getTrip(slug));
  const legacy = PACKAGE_CONTENT[slug];
  if (!pkg && !legacy) notFound();

  return (
    <>
      <Header />
      {pkg ? (
        <main className="bg-cream-dark">
          <PackageHero pkg={pkg} />

          <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-[1fr_26rem] lg:items-start">
            <div className="min-w-0">
              {pkg.summary ? (
                <p className="text-base leading-relaxed text-gray-700">{pkg.summary}</p>
              ) : null}
            </div>
            <PriceCallbackCard
              slug={pkg.slug}
              packageName={pkg.name}
              priceFromInr={pkg.priceFromInr}
            />
          </div>
        </main>
      ) : (
        /* Backend unreachable — the pre-existing page off bundled content. */
        <PackageDetail pkg={legacy!} />
      )}
      <Faq />
      <Footer />
    </>
  );
}
