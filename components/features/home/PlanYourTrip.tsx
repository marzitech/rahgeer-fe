import { LeadForm } from "./LeadForm";

/** Interim home for the lead form — the old photo hero carried it, and
 *  several pages (CTA banner, not-found, itinerary teasers, AI wizard)
 *  deep-link to #plan-your-trip inside it. Lives after Group Tours until
 *  the redesign's lower sections land. */
export function PlanYourTrip() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto w-full max-w-xl px-4">
        <LeadForm />
      </div>
    </section>
  );
}
