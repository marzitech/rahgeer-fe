"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Tell us about your holiday",
    description:
      "Share where you'd like to go, when, and how you love to travel.",
  },
  {
    title: "Receive a personalised plan",
    description:
      "Curated itineraries designed for your pace, comfort and interests.",
  },
  {
    title: "We book everything",
    description:
      "Flights, stays, local experiences and paperwork — all handled for you.",
  },
  {
    title: "Enjoy your holiday",
    description:
      "Travel with your Mitr a phone call away, every day of the trip.",
  },
];

const STEP_INTERVAL_MS = 4000;

/** "Simple. Personal. Yours." — crimson band; auto-advancing stepper with
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
      {/* Concentric-ring clusters in the background, per the design
          (Figma's decorative Ellipse groups) — darker rings at low opacity,
          offset across the band. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: [
            "repeating-radial-gradient(circle at 12% 20%, transparent 0, transparent 44px, #4d0629 45px, transparent 46px)",
            "repeating-radial-gradient(circle at 85% 75%, transparent 0, transparent 52px, #4d0629 53px, transparent 54px)",
            "repeating-radial-gradient(circle at 45% 110%, transparent 0, transparent 60px, #4d0629 61px, transparent 62px)",
          ].join(", "),
        }}
      />
      <div className="relative mx-auto max-w-[1192px] px-4">
        <SectionHeading
          dark
          eyebrow="How Marzi works"
          title="Simple. Personal. Yours."
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
            <Image
              src="/images/home/how-it-works.jpg"
              alt="A Marzi consultant walking through a personalised plan"
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
