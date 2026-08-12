import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { SampleItineraryView } from "@/components/features/plan/SampleItineraryView";

/** Curated sample itinerary page — reached from an Explore-destinations
 *  card. Shows the itinerary teaser; the full plan is gated behind the
 *  download lead form. */
export default async function SampleItineraryPage({
  params,
}: PageProps<"/itineraries/[slug]">) {
  const { slug } = await params;

  return (
    <>
      {/* Site chrome is hidden in print so the downloaded PDF is just the
          itinerary itself */}
      <div className="print:hidden">
        <Header />
      </div>
      <main className="min-h-screen bg-[#fdf7f2] pt-20 md:pt-24 print:min-h-0 print:bg-white print:pt-0">
        <SampleItineraryView slug={slug} />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
