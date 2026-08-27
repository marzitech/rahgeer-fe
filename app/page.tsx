import { Comparison } from "@/components/features/home/Comparison";
import { CtaBanner } from "@/components/features/home/CtaBanner";
import { Destinations } from "@/components/features/home/Destinations";
import { ExploringHero } from "@/components/features/home/ExploringHero";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { GroupTours } from "@/components/features/home/GroupTours";
import { Header } from "@/components/features/home/Header";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { MeetYourMitr } from "@/components/features/home/MeetYourMitr";
import { PlanningFor } from "@/components/features/home/PlanningFor";
import { PlanYourTrip } from "@/components/features/home/PlanYourTrip";
import { PressStrip } from "@/components/features/home/PressStrip";
import { Testimonials } from "@/components/features/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Redesigned top-of-page (Figma "Marzi Production" home redesign) */}
        <ExploringHero />
        <MeetYourMitr />
        <GroupTours />
        <PlanYourTrip />
        {/* Sections below keep the previous design until the redesign's
            remaining frames land. */}
        <PlanningFor />
        <Destinations />
        <PressStrip />
        <HowItWorks />
        <Comparison />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
