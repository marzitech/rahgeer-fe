import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const AUDIENCES = [
  {
    title: "Book for senior travellers",
    description: "Curated itineraries for people over 50.",
    image: "/images/home/book-senior-travellers.jpg", // senior couple planning at a laptop
    imagePosition: "object-[center_35%]",
    href: "/plan/yourself",
  },
  {
    title: "Gift your parents",
    description:
      "Curated itineraries designed for their pace, comfort and safety.",
    image: "/images/home/book-parents.jpg", // adult son on a call, parents' portrait behind
    imagePosition: "object-center",
    href: "/plan/parents",
  },
];

/** "Who are you planning for?" — two large photo cards with CTAs. */
export function PlanningFor() {
  return (
    <section className="hide-in-app bg-cream py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Book your trip"
          title="Who are you planning for?"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {AUDIENCES.map((audience) => (
            <div
              key={audience.title}
              className="group relative h-[340px] overflow-hidden rounded-3xl md:h-[400px]"
            >
              <Image
                src={audience.image}
                alt={audience.title}
                fill
                sizes="(max-width: 768px) 100vw, 556px"
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${audience.imagePosition}`}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-8 pt-24">
                <h3 className="font-display text-[26px] font-semibold text-white md:text-[32px]">
                  {audience.title}
                </h3>
                <p className="mt-1.5 text-sm text-white/85">
                  {audience.description}
                </p>
                <Link
                  href={audience.href}
                  className="text-foreground hover:bg-cream mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold shadow transition group-hover:gap-3"
                >
                  Start Planning <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
