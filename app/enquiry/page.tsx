import type { Metadata } from "next";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { LeadForm } from "@/components/features/home/LeadForm";

/** Standalone lead-capture landing page (campaign traffic) — just the
 *  planning lead form, nothing else. */

export const metadata: Metadata = {
  title: "Plan Your Trip — Marzi",
  description:
    "Tell us where you want to go and your Travel Mitr will call you to plan the whole trip — flights, hotels, visas and transfers.",
};

export default function EnquiryPage() {
  return (
    <>
      <Header />
      <main className="bg-[#fdf7f2] pt-20 md:pt-24">
        <div className="mx-auto max-w-[560px] px-4 py-8 md:py-12">
          <LeadForm formName="enquiry" />
        </div>
      </main>
      <Footer />
    </>
  );
}
