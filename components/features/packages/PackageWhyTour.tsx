import Image from "next/image";
import type { TermDescription } from "@/lib/content/package-detail";

/**
 * "Why Tour With Marzi?" — the senior-first promises.
 *
 * Three to a row on a desktop with the icon above its promise, one to a
 * row on a phone with the icon beside it: stacked in a single narrow
 * column, an icon on its own line wastes the height and separates the
 * glyph from the words it belongs to.
 *
 * The icons cycle through the five the file ships. They are decorative —
 * the promise is the heading, and the data carries no icon of its own,
 * so the cycle keeps the list from being a wall of text without
 * pretending each glyph means something specific.
 */
const ICONS = [
  "/images/figma/icon-guide.svg",
  "/images/figma/icon-doctor.svg",
  "/images/figma/icon-meals.svg",
  "/images/figma/icon-solo.svg",
  "/images/figma/icon-door.svg",
];

export function PackageWhyTour({ items }: { items: TermDescription[] }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-6 sm:p-10">
      <h2 className="font-display text-brand-deep text-[1.75rem] font-extrabold sm:text-4xl">
        Why Tour With Marzi?
      </h2>

      <ul className="mt-7 grid gap-x-10 gap-y-7 sm:mt-9 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.term} className="flex gap-4 sm:block">
            <Image
              src={ICONS[i % ICONS.length]}
              alt=""
              width={28}
              height={28}
              className="mt-0.5 size-6 shrink-0 sm:mb-4 sm:size-7"
            />
            <div className="min-w-0">
              <h3 className="text-brand-deep text-[0.95rem] leading-snug font-bold sm:text-base">
                {item.term}
              </h3>
              {item.description ? (
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gray-600 sm:text-sm">
                  {item.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
