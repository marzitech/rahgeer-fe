import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Headset, Heart, Map, Plane, UserRound } from "lucide-react";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { LeadForm } from "@/components/features/home/LeadForm";

/** Planning page (design: Frame 2147224441) — reached from the home
 *  "Who are you planning for?" Start Planning CTAs. */

const AUDIENCES = {
  yourself: {
    title: "Book for yourself",
    image: "/images/home/book-yourself-solo.jpg",
    imagePosition: "object-[center_30%]",
  },
  parents: {
    title: "Book for parents",
    image: "/images/home/book-parents-lake.jpg",
    imagePosition: "object-[center_40%]",
  },
} as const;

const WHY_MARZI = [
  { Icon: UserRound, label: "One dedicated Travel Mitr" },
  { Icon: Map, label: "Personalised itinerary planning" },
  { Icon: Plane, label: "Flights, hotels, visas and transfers handled" },
  { Icon: Headset, label: "Support before and during the trip" },
  { Icon: Heart, label: "No call-centre handoffs" },
];

const TRUSTED_AVATARS = [
  "/images/home/reviewer-anita.jpg",
  "/images/home/reviewer-priya.jpg",
  "/images/home/reviewer-vikram.jpg",
];

export function generateStaticParams() {
  return Object.keys(AUDIENCES).map((audience) => ({ audience }));
}

export default async function PlanPage({
  params,
}: PageProps<"/plan/[audience]">) {
  const { audience } = await params;
  const content = AUDIENCES[audience as keyof typeof AUDIENCES];
  if (!content) notFound();

  return (
    <>
      <Header />
      <main className="bg-[#fdf7f2] pt-20 md:pt-24">
        <div className="mx-auto max-w-[1192px] px-4 py-8">
          <Link
            href="/"
            className="text-brand inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Travel
          </Link>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_440px]">
            {/* Form card (LeadForm carries the design's warm gradient) */}
            <LeadForm
              heading={content.title}
              audience={audience as "yourself" | "parents"}
              showAiPlanner
            />

            {/* Why travellers choose Marzi */}
            <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <div
                className={`relative h-[220px] w-full overflow-hidden rounded-xl`}
              >
                <Image
                  src={content.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className={`object-cover ${content.imagePosition}`}
                />
              </div>
              <h2 className="font-display text-brand mt-5 text-2xl font-bold">
                Why travellers choose Marzi
              </h2>
              <ul className="mt-4 space-y-3.5">
                {WHY_MARZI.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <Icon
                      className="text-brand h-4.5 w-4.5 shrink-0"
                      strokeWidth={1.8}
                    />
                    {label}
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 py-1.5 pr-4 pl-1.5">
                <div className="flex -space-x-2">
                  {TRUSTED_AVATARS.map((src) => (
                    <span
                      key={src}
                      className="relative size-6 overflow-hidden rounded-full border-2 border-white"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </span>
                  ))}
                </div>
                <p className="text-xs font-medium text-green-700">
                  Trusted by <strong>1000+</strong> families across India
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
