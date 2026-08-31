"use client";
import { Comparison } from "@/components/features/home/Comparison";
import { CtaBanner } from "@/components/features/home/CtaBanner";
import { CuratedTrips } from "@/components/features/home/CuratedTrips";
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
import { trackEvent } from "@/lib/api/trackEvent";
import { debounce } from "@/lib/debounce";
import { EVENTS } from "@/lib/event";
import { useTracking } from "@/lib/sectionTracking";

import { useEffect } from "react";

export default function HomePage() {
  // fire page view started here

  useEffect(() => {
    trackEvent(EVENTS.HOME_PAGE_VIEWED);

    // now adding the debouncing values;
    const handleScroll = debounce(() => {
      trackEvent(EVENTS.SCROLL_DEPTH_HOME, { scrollY: window.scrollY });
    }, 1000);

    // now adding the complete window;
    window.addEventListener("scroll", handleScroll);

    // here memory free peocess for the returing process;
    return window.removeEventListener("scroll", handleScroll);
  }, []);

  useTracking();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TravelMitr />
        <PlanningFor />
        <CuratedTrips />
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
