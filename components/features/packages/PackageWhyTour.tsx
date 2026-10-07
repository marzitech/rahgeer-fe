import Image from "next/image";
import type { TermDescription } from "@/lib/content/package-detail";

/**
 * "Why Tour With Marzi?" — the senior-first promises, three to a row.
 *
 * The icons cycle through the five the design ships. They are
 * decorative: the promise is the heading, and the data carries no icon
 * of its own, so the cycle keeps the grid from being a wall of text
 * without pretending each glyph means something specific.
 */
const ICONS = [
  "/images/figma/icon-user.svg",
  "/images/figma/icon-heart.svg",
  "/images/figma/icon-utensils.svg",
  "/images/figma/icon-shield.svg",
  "/images/figma/icon-car.svg",
];

export function PackageWhyTour({ items }: { items: TermDescription[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="bg-sand rounded-3xl border border-[#e5e7eb] p-6 sm:p-10">
        <h2 className="font-display text-brand-deep text-[1.75rem] font-extrabold sm:text-4xl">
          Why Tour With Marzi?
        </h2>

        <ul className="mt-8 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.term}>
              <span className="bg-sand-deep flex size-11 items-center justify-center rounded-full">
                <Image
                  src={ICONS[i % ICONS.length]}
                  alt=""
                  width={22}
                  height={22}
                  className="size-[1.375rem]"
                />
              </span>
              <h3 className="font-display text-navy mt-4 text-base font-bold sm:text-lg">
                {item.term}
              </h3>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
