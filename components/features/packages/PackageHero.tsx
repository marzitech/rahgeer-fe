"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Check } from "lucide-react";
import type { PackageDetail } from "@/lib/content/package-detail";
import { cn } from "@/lib/utils";

/**
 * The package page's opening: photo, title and the facts someone checks
 * before reading any further — when it runs, how long, what is included.
 *
 * The copy sits over the lower-left of the photo in white, so the scrim
 * has to hold whatever image ops uploads.
 */
export function PackageHero({ pkg }: { pkg: PackageDetail }) {
  const [index, setIndex] = useState(0);
  const images = pkg.gallery.length > 0 ? pkg.gallery : [""];
  const image = images[index];

  return (
    <section className="bg-sand pt-28 pb-6 lg:pt-28">
      <div className="mx-auto max-w-6xl px-4">
        <Link
          href="/#trips"
          className="text-brand-deep mb-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to destinations
        </Link>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[1290/415]">
          {image ? (
            <Image
              src={image}
              alt={pkg.name}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          ) : (
            <div className="bg-sand-deep size-full" />
          )}
          {/* Dark at the bottom-left where the copy sits, clear top-right
              so the photograph is still the photograph. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 sm:gap-4 sm:p-10">
            <span className="bg-sand-deep inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-black sm:text-[0.92rem]">
              <Check className="text-brand-deep size-3.5" aria-hidden />
              Curated package
              <span aria-hidden className="text-brand-deep">
                •
              </span>
              Ready to book
            </span>

            <h1 className="font-display text-2xl leading-tight font-semibold text-white sm:text-[2.6rem]">
              {pkg.title}
            </h1>

            {pkg.datesLabel || pkg.durationLabel ? (
              <p className="font-label flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-white sm:text-[1.3rem]">
                <CalendarDays className="size-5 shrink-0" aria-hidden />
                {pkg.datesLabel}
                {pkg.datesLabel && pkg.durationLabel ? (
                  <span aria-hidden className="text-white/70">
                    •
                  </span>
                ) : null}
                {pkg.durationLabel}
              </p>
            ) : null}

            {pkg.packageType || pkg.mealsLabel ? (
              <div className="flex flex-wrap gap-3">
                {[pkg.packageType, pkg.mealsLabel].filter(Boolean).map((label) => (
                  <span
                    key={label}
                    className="text-brand-deep rounded-full bg-white px-5 py-1.5 text-xs font-semibold sm:text-[0.92rem]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="absolute right-5 bottom-5 flex gap-2 sm:right-8">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>

        {pkg.placesCovered.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-label text-navy text-xs font-bold tracking-[0.08em] uppercase sm:text-sm">
              Places covered
            </span>
            {pkg.placesCovered.map((place) => (
              <span
                key={place}
                className="bg-sand-deep text-brand-deep rounded-full px-4 py-1.5 text-xs font-semibold sm:text-sm"
              >
                {place}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
