import type { TitleBody } from "@/lib/content/package-detail";

/**
 * The cancellation policy.
 *
 * Numbered clauses rather than one block of prose: this is the wording a
 * traveller will hold Marzi to, and a numbered clause can be pointed at
 * over the phone. Shared across tours unless one has written its own, so
 * it is edited once in Travel → Tour Defaults.
 */
export function PackageCancellation({ clauses }: { clauses: TitleBody[] }) {
  if (clauses.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-3xl bg-white p-6 sm:p-9">
        <h2 className="font-display text-brand-deep text-[1.75rem] font-extrabold sm:text-4xl">
          Our Cancellation Policy
        </h2>

        <ol className="mt-7 space-y-6">
          {clauses.map((clause, index) => (
            <li key={clause.title || index} className="flex gap-4">
              <span
                aria-hidden
                className="bg-sand-deep text-brand-deep flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                {clause.title ? (
                  <h3 className="text-navy text-[0.95rem] font-bold sm:text-base">
                    {clause.title}
                  </h3>
                ) : null}
                {clause.body ? (
                  <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-gray-600 sm:text-[0.9375rem]">
                    {clause.body}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
