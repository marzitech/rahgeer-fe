import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Meetups", href: "/meetups" },
  { label: "Contact Us", href: "/contact" },
];

/** Deep-purple top bar: logo · TRAVEL badge + nav · download CTA. */
export function Header() {
  return (
    <header className="bg-marzi-purple text-white">
      <div className="mx-auto flex h-[84px] max-w-[1192px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-3xl font-bold tracking-tight"
          >
            Marzi
          </Link>
          <span aria-hidden className="h-6 w-px bg-white/25" />
          <nav className="flex items-center gap-8 text-sm">
            <span className="bg-gold text-ink rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
              Travel
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/85 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <span aria-hidden className="h-6 w-px bg-white/25" />
          <a
            href="#plan-your-trip"
            className="bg-gold text-ink rounded-full px-5 py-2.5 text-sm font-semibold transition hover:brightness-95"
          >
            Download App
          </a>
        </div>
      </div>
      {/* Scalloped bottom edge from the design */}
      <div
        aria-hidden
        className="bg-marzi-purple h-[6px] w-full"
        style={{
          maskImage:
            "radial-gradient(circle 5px at 5px 0, transparent 5px, black 5px)",
          maskSize: "10px 6px",
          maskRepeat: "repeat-x",
        }}
      />
    </header>
  );
}
