/** Press coverage of Marzi's launch, shown as a continuously scrolling strip
 *  of outlet wordmarks. Each links out to the published article (new tab).
 *  Wordmarks are styled text until real logo assets arrive. */
const ARTICLES = [
  {
    outlet: "BW Travel",
    href: "https://www.bwtravel.com/industry-insights/marzi-introduces-generation-evergreen-travel-service-for-seniors-12044306",
  },
  {
    outlet: "The Economic Times",
    href: "https://travel.economictimes.indiatimes.com/news/technology/gds/marzi-unveils-ai-powered-travel-concierge-service-for-seniors-in-india/131770649",
  },
  {
    outlet: "Healthwealthbridge",
    href: "https://healthwealthbridge.com/marzi-unveils-indias-first-ai-powered-hybrid-travel-ecosystem-for-seniors-pressrelease/",
  },
  {
    outlet: "NomadLawyer",
    href: "https://nomadlawyer.org/marzi-ai-powered-travel-concierge-june-2026",
  },
];

/** "Featured in" — auto-scrolling press-outlet marquee (pauses on hover). */
export function PressStrip() {
  return (
    <section id="pressstrip" className="bg-cream overflow-hidden py-12">
      <p className="text-foreground/50 text-center text-xs font-semibold tracking-[0.25em] uppercase">
        Featured in
      </p>

      {/* Full-bleed marquee: two identical halves scroll continuously; soft
          fades at the edges. */}
      <div
        className="mt-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((half) => (
            <div
              key={half}
              aria-hidden={half === 1}
              className="flex shrink-0 items-center"
            >
              {[0, 1, 2].flatMap((rep) =>
                ARTICLES.map(({ outlet, href }) => (
                  <a
                    key={`${rep}-${outlet}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-foreground/45 hover:text-brand mx-8 text-xl font-semibold whitespace-nowrap transition-colors md:mx-12 md:text-2xl"
                  >
                    {outlet}
                  </a>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
