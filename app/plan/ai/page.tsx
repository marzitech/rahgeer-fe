import { ArrowLeft } from "lucide-react";
import { BackLink } from "@/components/BackLink";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { AiTripWizard } from "@/components/features/plan/AiTripWizard";

/** AI trip-planner wizard page — opened from the "Plan Trip using AI Trip
 *  planner" button on the planning pages. */
export default function AiPlanPage() {
  return (
    <>
      {/* Site chrome is hidden in print — the downloaded itinerary PDF
          carries only the dossier itself */}
      <div className="print:hidden">
        <Header />
      </div>
      <main className="min-h-screen bg-[#fdf7f2] pt-20 md:pt-24 print:pt-0">
        <div className="mx-auto max-w-[1192px] px-4 py-8">
          <BackLink
            href="/"
            className="text-brand inline-flex items-center gap-2 text-sm font-semibold hover:underline print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Travel
          </BackLink>

          <div className="mt-4 print:mt-0">
            <AiTripWizard />
          </div>
        </div>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
