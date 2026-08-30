import { AiTripPlanner } from "@/components/features/home/AiTripPlanner";
import { ExploringHero } from "@/components/features/home/ExploringHero";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { GroupTours } from "@/components/features/home/GroupTours";
import { Header } from "@/components/features/home/Header";
import { MeetYourMitr } from "@/components/features/home/MeetYourMitr";
import { PressStrip } from "@/components/features/home/PressStrip";
import { Testimonials } from "@/components/features/home/Testimonials";

/** Home — full redesign per Figma "Marzi Production" (node 5557-97839).
 *  Lead capture lives on /enquiry; every "Talk to a Marzi Mitr" CTA and
 *  cross-page planning link points there. */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ExploringHero />
        <MeetYourMitr />
        <GroupTours />
        <AiTripPlanner />
        <Testimonials />
        <PressStrip />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
