import type { Metadata } from "next";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { LeadForm } from "@/components/features/home/LeadForm";
import { isAppWebView } from "@/lib/app-webview";

/** Standalone lead-capture landing page (campaign traffic) — just the
 *  planning lead form, nothing else. */

export const metadata: Metadata = {
  title: "Plan Your Trip — Marzi",
  description:
    "Tell us where you want to go and your Travel Mitr will call you to plan the whole trip — flights, hotels, visas and transfers.",
};

export default async function EnquiryPage({
  searchParams,
}: PageProps<"/enquiry">) {
  // The mobile app links here with ?source=app so its leads are
  // channelled separately from organic website traffic in the ops sheet.
  const { source } = await searchParams;
  const fromApp = source === "app";
  // The fixed header is hidden inside the app WebView — drop the top
  // padding that exists only to clear it.
  const isApp = await isAppWebView();

  return (
    <>
      <Header />
      <main className={isApp ? "bg-[#fdf7f2]" : "bg-[#fdf7f2] pt-20 md:pt-24"}>
        <div className="mx-auto max-w-[560px] px-4 py-8 md:py-12">
          <LeadForm
            formName="Website Landing Page"
            source={fromApp ? "app" : "website"}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
