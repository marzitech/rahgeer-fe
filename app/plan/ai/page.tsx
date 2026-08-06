import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { AiTripWizard } from "@/components/features/plan/AiTripWizard";

/** AI trip-planner wizard page — opened from the "Plan Trip using AI Trip
 *  planner" button on the planning pages. */
export default function AiPlanPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fdf7f2] pt-20 md:pt-24">
        <div className="mx-auto max-w-[1192px] px-4 py-8">
          <Link
            href="/"
            className="text-brand inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Travel
          </Link>

          <div className="mt-4">
            <AiTripWizard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
