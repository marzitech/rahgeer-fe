import { Phone } from "lucide-react";

/** "Let's Plan Your Next Holiday Together" — closing CTA card on cream:
 *  black-plum → pink-crimson gradient with faint concentric rings, serif
 *  heading with soft-gold line, pink + outline button pair (per design). */
export function CtaBanner() {
  return (
    <section className="bg-cream pb-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#170309] via-[#6d1039] to-[#c02460] px-6 py-12 text-center text-white md:px-8 md:py-16">
          {/* Circular pattern texture at 7% opacity (per design) */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[length:520px] bg-repeat opacity-[0.07]"
            style={{
              backgroundImage: "url('/images/textures/circular-pattern.png')",
            }}
          />

          <div className="relative">
            <h2 className="font-display text-[30px] leading-tight font-semibold text-balance md:text-[44px]">
              Let&apos;s Plan
              <br />
              <span className="text-[#ecc464]">Your Next Holiday</span> Together
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] text-white/85">
              Tell us where you&apos;d like to go. Your dedicated Travel Mitr
              will help plan and book every detail.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/enquiry"
                className="bg-marzi-pink flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:brightness-110"
              >
                <Phone
                  className="h-4 w-4"
                  fill="currentColor"
                  strokeWidth={0}
                />
                Talk to a Travel Mitr
              </a>
              <a
                href="/enquiry"
                className="rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10"
              >
                Request a Callback
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
