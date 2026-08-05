import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Meetups", href: "/meetups" },
  { label: "Contact Us", href: "/contact" },
];

/* Campaign badge (Bold Fest) — gated so it can be switched off after the
   campaign without deleting the markup (house convention from marzi-web). */
const SHOW_CAMPAIGN_BADGE = true;

/** Deep-purple top bar: marzi logo · nav (TRAVEL active) · campaign badge ·
 *  Download App. Orange scalloped trim underneath, per the design. */
export function Header() {
  return (
    <header className="bg-marzi-purple text-white">
      <div className="mx-auto flex h-[64px] max-w-[1192px] items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="leading-none">
            <span className="font-display text-[26px] font-bold tracking-tight lowercase">
              marzi<span className="text-gold">.</span>
            </span>
            <span className="mt-0.5 block text-[7px] tracking-[0.14em] text-white/50 uppercase">
              Your Life. Your Terms
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-[13px] font-medium tracking-wide uppercase">
            <span className="text-gold">Travel</span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {SHOW_CAMPAIGN_BADGE ? (
            <div className="ring-gold/60 rounded-md bg-gradient-to-b from-red-600 to-red-800 px-3 py-1 text-center shadow ring-1">
              <p className="text-gold text-[11px] leading-tight font-black tracking-wider uppercase">
                Bold Fest
              </p>
              <p className="text-[8px] leading-tight text-white/90">
                10 July – 31 July
              </p>
            </div>
          ) : null}
          <span aria-hidden className="h-6 w-px bg-white/25" />
          <a
            href="#plan-your-trip"
            className="bg-brand hover:bg-brand-deep flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            <DownloadIcon />
            Download App
          </a>
        </div>
      </div>
      {/* Orange scalloped trim under the bar */}
      <div
        aria-hidden
        className="h-[6px] w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"
        style={{
          maskImage:
            "radial-gradient(circle 4px at 5px 0, transparent 4px, black 4px)",
          maskSize: "10px 6px",
          maskRepeat: "repeat-x",
        }}
      />
    </header>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 16 6 10h4V3h4v7h4l-6 6Zm-7 4v-2h14v2H5Z" />
    </svg>
  );
}
