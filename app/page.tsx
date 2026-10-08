import { FaqNumbered } from "@/components/features/home/FaqNumbered";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { HeroCarousel } from "@/components/features/home/HeroCarousel";
import { HomeTracking } from "@/components/features/home/HomeTracking";
import { TravelExpert } from "@/components/features/home/TravelExpert";
import { TripsThisMonth } from "@/components/features/home/TripsThisMonth";
import { WhyTravelWithUs } from "@/components/features/home/WhyTravelWithUs";
import { getHomeContent, getTrips } from "@/lib/content/fetchers";

/**
 * The home page is server-rendered and revalidated on a timer, so a photo
 * or a price changed in the admin dashboard appears within a minute
 * without a deploy. Both reads fall back to bundled content, so the page
 * renders even when the backend is down.
 *
 * Written as a literal because Next statically analyses segment config —
 * an imported constant is silently ignored. Keep it in step with
 * REVALIDATE_SECONDS in lib/content/fetchers.ts.
 */
export const revalidate = 60;

export default async function HomePage() {
  const [content, trips] = await Promise.all([getHomeContent(), getTrips()]);

  return (
    <>
      <HomeTracking />
      <Header />
      <main>
        <HeroCarousel banners={content.heroBanners} />
        {/* One band, one map: the watermark has to run continuously
            behind both sections rather than restart at each one. */}
        <div className="texture-worldmap bg-cream-dark">
          <TripsThisMonth trips={trips} />
          <WhyTravelWithUs features={content.features} expert={content.expert} />
        </div>
        <TravelExpert expert={content.expert} />
        {/* "Postcards from our travellers" (TravellersAbout) is hidden for now;
            the component is untouched — re-add it here to bring it back. */}
        <FaqNumbered items={content.faqs} />
      </main>
      <Footer />
    </>
  );
}
