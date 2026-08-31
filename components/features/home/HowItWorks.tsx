"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Tell us about your holiday",
    description:
      "Where do you want to go? How many people? Tell your Travel Mitr.",
    image: "/images/home/how-marzi-works.png",
    alt: "A senior couple sharing their holiday wishes over a map and guidebook",
  },
  {
    title: "Receive a personalised plan",
    description:
      "We will recommend flights, hotels, sightseeing, restaurants, and a comfortable itinerary designed around your group.",
    image: "/images/home/book-senior-travellers.jpg",
    alt: "A senior couple reviewing their personalised printed itinerary",
  },
  {
    title: "We book everything",
    description:
      "Flights, hotels, visa, insurance, forex and more — all handled by your Travel Mitr.",
    image: "/images/home/how-marzi-works.jpg",
    alt: "Senior travellers consulting with their Marzi Travel Mitr",
  },
  {
    title: "Enjoy your holiday",
    description:
      "Relax and focus on making memories. We'll take care of the planning.",
    image: "/images/home/travel-with-group.jpg",
    alt: "A group of senior travellers setting off on their holiday together",
  },
];

const STEP_INTERVAL_MS = 4000;

/** "Simplified. Personalised. Group travel." — crimson band; auto-advancing stepper with
 *  expanding descriptions (pauses on hover, clickable) + consultant photo. */
export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(
      () => setActiveStep((step) => (step + 1) % STEPS.length),
      STEP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="relative overflow-hidden bg-[#a02458] py-20 text-white">
      {/* Circular pattern texture at 7% opacity (per design) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[length:520px] bg-repeat opacity-[0.07]"
        style={{
          backgroundImage: "url('/images/textures/circular-pattern.png')",
        }}
      />
      <div className="relative mx-auto max-w-[1192px] px-4">
        <SectionHeading
          dark
          eyebrow="How Marzi works"
          title="Simplified. Personalised. Group travel."
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_640px]">
          <ol
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <li key={step.title} className="relative">
                  {/* Segment of the vertical progress line */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-0 bottom-0 left-0 w-px transition-colors duration-500",
                      isActive ? "bg-gold" : "bg-white/25",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                    aria-current={isActive ? "step" : undefined}
                    className="w-full py-5 pl-8 text-left"
                  >
                    <h3
                      className={cn(
                        "font-display text-xl font-semibold transition-all duration-500 md:text-2xl",
                        isActive
                          ? "text-white"
                          : "text-white/50 hover:text-white/75",
                      )}
                    >
                      {step.title}
                    </h3>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-in-out",
                        isActive
                          ? "mt-2 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <p className="max-w-md overflow-hidden text-sm text-white/80">
                        {step.description}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="relative h-[280px] w-full overflow-hidden rounded-3xl md:h-[400px] lg:h-[480px]">
            {/* All step images stay mounted; the active one crossfades in. */}
            {STEPS.map((step, index) => (
              <Image
                key={step.image}
                src={step.image}
                alt={index === activeStep ? step.alt : ""}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className={cn(
                  "object-cover transition-opacity duration-700",
                  index === activeStep ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
