"use client";

import { useEffect, useState } from "react";
import { listPackages } from "@/lib/api/endpoints";

type BackendPackage = {
  id: string;
  slug: string;
  display_name: string;
  destination: string;
  summary: string;
  default_duration_nights: number | null;
  price_from_inr: number | null;
};

/** Live packages for this destination from rahgeer-be. Interim card list —
 *  restyle against Figma node 3541-27094 when the design export lands. */
export function PackageList({ destinationName }: { destinationName: string }) {
  const [packages, setPackages] = useState<BackendPackage[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    listPackages(destinationName)
      .then((data) => setPackages(data.results as BackendPackage[]))
      .catch(() => setFailed(true));
  }, [destinationName]);

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-[1192px] px-4">
        {packages === null && !failed ? (
          <p className="text-foreground/50 text-center">Loading packages…</p>
        ) : null}

        {failed ? (
          <p className="text-foreground/60 text-center">
            Couldn&apos;t load packages right now — please try again shortly.
          </p>
        ) : null}

        {packages !== null && packages.length === 0 ? (
          <div className="text-center">
            <p className="text-foreground/70">
              Our {destinationName} packages are being curated. Tell us what
              you&apos;re dreaming of and your Travel Mitr will build one for
              you.
            </p>
            <a
              href="/#plan-your-trip"
              className="bg-brand hover:bg-brand-deep mt-6 inline-block rounded-full px-7 py-3.5 text-sm font-semibold text-white transition"
            >
              Plan my trip
            </a>
          </div>
        ) : null}

        {packages !== null && packages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold">
                  {pkg.display_name}
                </h3>
                {pkg.default_duration_nights ? (
                  <p className="text-foreground/50 mt-1 text-xs">
                    {pkg.default_duration_nights} nights ·{" "}
                    {pkg.default_duration_nights + 1} days
                  </p>
                ) : null}
                <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
                  {pkg.summary}
                </p>
                {pkg.price_from_inr ? (
                  <p className="mt-4 text-sm">
                    Starting from{" "}
                    <span className="text-brand text-lg font-bold">
                      ₹{pkg.price_from_inr.toLocaleString("en-IN")}
                    </span>
                  </p>
                ) : null}
                <a
                  href="/#plan-your-trip"
                  className="bg-brand hover:bg-brand-deep mt-5 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                >
                  Enquire now
                </a>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
