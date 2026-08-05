import { Comparison } from "@/components/features/home/Comparison";
import { CtaBanner } from "@/components/features/home/CtaBanner";
import { Destinations } from "@/components/features/home/Destinations";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { Hero } from "@/components/features/home/Hero";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { PlanningFor } from "@/components/features/home/PlanningFor";
import { PressStrip } from "@/components/features/home/PressStrip";
import { Testimonials } from "@/components/features/home/Testimonials";
import { TravelMitr } from "@/components/features/home/TravelMitr";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TravelMitr />
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
