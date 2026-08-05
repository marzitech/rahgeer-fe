import Link from "next/link";

const EXPLORE = [
  "Home",
  "About Us",
  "Meetups",
  "Holidays",
  "Contact Us",
  "Stories",
];
const POLICIES = [
  "Privacy Policy",
  "Terms & Conditions",
  "Refund Policy",
  "Shipping Policy",
];
const SOCIALS = ["Facebook", "Instagram", "YouTube", "LinkedIn"];

/** Purple footer: brand blurb, link columns, address, legal line. */
export function Footer() {
  return (
    <footer className="bg-marzi-purple text-white">
      <div className="mx-auto max-w-[1192px] px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <p className="font-display text-3xl font-bold">Marzi</p>
            <p className="mt-4 max-w-[220px] text-sm text-white/70">
              Empowering Generation Evergreen with meaningful connections and
              curated experiences.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs transition hover:bg-white/25"
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          <nav>
            <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {EXPLORE.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
              Policies
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {POLICIES.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-white/80 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
              Visit Us
            </p>
            <p className="mt-4 text-sm text-white/80">
              22, HARA CHAMBER, 3rd Floor, KH Road, Shantinagar, Bengaluru —
              560027
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row">
          <p>MARZI AGETECH PRIVATE LIMITED</p>
          <p>© 2026 Marzi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
