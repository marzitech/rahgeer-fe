import Image from "next/image";
import Link from "next/link";
import { FileText, HeartPulse, Phone, Soup } from "lucide-react";
import { SparkleChip } from "./SparkleChip";

const BENEFITS = [
  {
    Icon: FileText,
    title: "Visa & travel support",
    description:
      "Help with visas, documents, flights and pre-travel requirements.",
  },
  {
    Icon: Soup,
    title: "Hygienic food planning",
    description:
      "Guidance around clean, comfortable and suitable meal options.",
  },
  {
    Icon: HeartPulse,
    title: "Medical preparedness",
    description:
      "Support with basic medical kits and important health considerations.",
  },
];

const MITR = {
  name: "Nabeel Sarfaraz",
  blurb: "Helping travellers plan comfortable, worry-free holidays.",
  portrait: "/images/home/travel-mitr-portrait.jpg",
  stats: [
    { value: "17", label: "Countries" },
    { value: "1000+", label: "Seniors" },
  ],
};

/** Crimson Mitr band under the hero watermark: "Travel Confidently with
 *  your Marzi Mitr" + three gold benefit rows on the left, Nabeel's cream
 *  profile card (portrait, stats, black CTA) on the right. */
export function MeetYourMitr() {
  return (
    <section className="bg-white px-4 pb-16 md:pb-20">
      <div className="mx-auto max-w-[1192px] rounded-[28px] bg-gradient-to-br from-[#8a1149] to-[#a3195b] p-6 text-white shadow-xl md:rounded-[32px] md:p-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <div className="text-center lg:text-left">
            <SparkleChip label="Meet Your Marzi Mitr" />
            <h2 className="font-display mt-4 text-[26px] leading-tight font-bold text-balance md:text-[32px]">
              <span className="text-gold">Travel Confidently.</span>
              <br />
              Your Marzi Travel Mitr
              <br />
              Takes care of everything.
            </h2>

            <div className="mt-7 space-y-5">
              {BENEFITS.map(({ Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4"
                >
                  <span className="border-gold/60 flex size-11 shrink-0 items-center justify-center rounded-full border bg-white/5">
                    <Icon className="text-gold h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-gold text-[15px] font-bold">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/80">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nabeel profile card */}
          <div className="mx-auto w-full max-w-[320px] rounded-[22px] bg-[#fdf6e8] p-4 text-center shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={MITR.portrait}
                alt={MITR.name}
                fill
                sizes="300px"
                className="object-cover object-top"
              />
            </div>
            <p className="font-display text-foreground mt-4 text-xl font-bold">
              {MITR.name}
            </p>
            <p className="text-foreground/60 mt-1 text-xs leading-relaxed">
              {MITR.blurb}
            </p>
            <p className="text-foreground mt-3 flex items-center justify-center divide-x divide-black/15 text-xs">
              {MITR.stats.map((stat) => (
                <span key={stat.label} className="px-3">
                  <strong className="text-brand text-sm font-bold">
                    {stat.value}
                  </strong>{" "}
                  {stat.label}
                </span>
              ))}
            </p>
            <Link
              href="/travel-mitr"
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-black py-3 text-sm font-bold text-white transition hover:bg-black/85"
            >
              <Phone className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              Plan My Trip With Nabeel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
