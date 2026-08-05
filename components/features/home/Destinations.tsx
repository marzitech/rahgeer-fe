"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TABS = [
  "All",
  "International",
  "India",
  "Spiritual",
  "Mountains",
  "Beaches",
  "Wellness",
  "First International Trip",
] as const;

type Tab = (typeof TABS)[number];

const DESTINATIONS: {
  name: string;
  blurb: string;
  tags: Tab[];
}[] = [
  {
    name: "Europe",
    blurb: "Grand cities, scenic rail journeys and unhurried sightseeing.",
    tags: ["International", "First International Trip"],
  },
  {
    name: "Kashmir",
    blurb: "Houseboats, gardens and mountain air at a gentle pace.",
    tags: ["India", "Mountains"],
  },
  {
    name: "Japan",
    blurb: "Culture, comfort and cherry blossoms made easy to explore.",
    tags: ["International"],
  },
  {
    name: "Kerala",
    blurb: "Backwaters, ayurveda and slow mornings by the water.",
    tags: ["India", "Wellness", "Beaches"],
  },
  {
    name: "Vietnam",
    blurb: "Gentle adventures for your first trip beyond the familiar.",
    tags: ["International", "First International Trip"],
  },
  {
    name: "Rajasthan",
    blurb: "Palaces, heritage stays and royal comfort throughout.",
    tags: ["India", "Spiritual"],
  },
];

/** "Where would you like to go next?" — filter tabs + destination cards. */
export function Destinations() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const visible = DESTINATIONS.filter(
    (d) => activeTab === "All" || d.tags.includes(activeTab),
  );

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Explore destinations"
          title="Where would you like to go next?"
          subtitle="Every holiday is planned around how you like to travel."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-brand text-white"
                  : "text-foreground/70 hover:bg-brand/10 bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((destination) => (
            <div
              key={destination.name}
              className="group relative h-[400px] overflow-hidden rounded-3xl"
            >
              <ImagePlaceholder
                label={destination.name}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 pt-16">
                <h3 className="font-display text-2xl font-semibold text-white">
                  {destination.name}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {destination.blurb}
                </p>
                <a
                  href="#plan-your-trip"
                  className="text-gold mt-4 inline-block text-sm font-semibold"
                >
                  Plan This Trip →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
