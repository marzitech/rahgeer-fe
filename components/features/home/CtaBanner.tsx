/** "Let's Plan Your Next Holiday Together" — dark closing CTA card. */
export function CtaBanner() {
  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <div className="from-ink to-brand-darker rounded-3xl bg-gradient-to-b px-8 py-16 text-center text-white">
          <h2 className="font-display text-4xl font-semibold text-balance">
            Let&apos;s Plan
            <br />
            <span className="text-gold italic">Your Next Holiday</span> Together
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/75">
            Tell us where you&apos;d like to go. Your dedicated Travel Mitr will
            help plan and book every detail.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#plan-your-trip"
              className="bg-brand hover:bg-brand-deep rounded-full px-7 py-3.5 text-sm font-semibold transition"
            >
              📞 Talk to a Travel Mitr
            </a>
            <a
              href="#plan-your-trip"
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Request a Callback
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
