import Image from "next/image";
import Link from "next/link";

/* lucide-react v1 ships no brand icons — standard brand glyph paths inline. */
function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.35-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.35-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.35 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

// Brand-site links resolve to marzi.life (this is the Travel sub-site);
// "Holidays" and "Explore Destinations" stay on the travel site.
const MARZI_SITE = "https://marzi.life";

const EXPLORE = [
  { label: "Home", href: MARZI_SITE },
  { label: "About Us", href: `${MARZI_SITE}/about-us` },
  { label: "Meetups", href: `${MARZI_SITE}/events` },
  { label: "Holidays", href: "/" },
  { label: "Contact Us", href: `${MARZI_SITE}/contact-us` },
  { label: "Stories", href: `${MARZI_SITE}/stories` },
];
const POLICIES = [
  { label: "Privacy Policy", href: `${MARZI_SITE}/privacy-policy` },
  { label: "Terms & Conditions", href: `${MARZI_SITE}/terms-and-conditions` },
  { label: "Refund Policy", href: `${MARZI_SITE}/refund-policy` },
  { label: "Shipping Policy", href: `${MARZI_SITE}/shipping-policy` },
];
const SOCIALS = [
  { name: "Facebook", href: MARZI_SITE, Icon: FacebookIcon },
  { name: "Instagram", href: MARZI_SITE, Icon: InstagramIcon },
  { name: "YouTube", href: MARZI_SITE, Icon: YoutubeIcon },
  { name: "LinkedIn", href: MARZI_SITE, Icon: LinkedinIcon },
];

/** Decorative landmark-skyline silhouette band above the footer content.
 *  (CSS/SVG approximation of the design's skyline art — swap for the
 *  exported Figma asset when available.) */
function Skyline() {
  return (
    <div aria-hidden className="overflow-hidden bg-[#fbf5e6]">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="xMidYMax slice"
        className="h-20 w-full text-[#ded2b4] md:h-28"
        fill="currentColor"
      >
        {/* Ground line */}
        <rect x="0" y="112" width="1440" height="8" />
        {/* Generic low buildings */}
        <rect x="0" y="72" width="70" height="48" />
        <rect x="80" y="88" width="50" height="32" />
        {/* India Gate style arch */}
        <path d="M150 120v-52c0-16 12-28 27-28s27 12 27 28v52h-12v-48a15 15 0 0 0-30 0v48Z" />
        <rect x="146" y="34" width="62" height="8" rx="2" />
        {/* Mid buildings */}
        <rect x="230" y="80" width="46" height="40" />
        <rect x="286" y="64" width="34" height="56" />
        {/* Taj-style dome */}
        <path d="M360 120v-44c0-8 6-12 10-16-6-8-6-18 12-30 18 12 18 22 12 30 4 4 10 8 10 16v44Z" />
        <rect x="346" y="60" width="6" height="60" />
        <rect x="412" y="60" width="6" height="60" />
        <circle cx="349" cy="56" r="4" />
        <circle cx="415" cy="56" r="4" />
        {/* Skyscraper cluster */}
        <rect x="450" y="48" width="30" height="72" />
        <rect x="488" y="70" width="42" height="50" />
        <rect x="540" y="56" width="26" height="64" />
        {/* Temple gopuram */}
        <path d="M600 120v-30h-8l28-56 28 56h-8v30Z" />
        {/* Buildings */}
        <rect x="680" y="76" width="52" height="44" />
        <rect x="742" y="60" width="30" height="60" />
        <rect x="780" y="86" width="56" height="34" />
        {/* Dome pavilion */}
        <path d="M870 120v-36a28 28 0 0 1 56 0v36Z" />
        <rect x="866" y="80" width="6" height="40" />
        <rect x="924" y="80" width="6" height="40" />
        {/* Tower with spire */}
        <rect x="970" y="52" width="24" height="68" />
        <path d="M970 52h24l-12-24Z" />
        {/* Buildings */}
        <rect x="1020" y="72" width="44" height="48" />
        <rect x="1074" y="88" width="60" height="32" />
        {/* Charminar-style block */}
        <rect x="1160" y="56" width="70" height="64" />
        <circle cx="1166" cy="52" r="6" />
        <circle cx="1224" cy="52" r="6" />
        <path d="M1180 120v-24a15 15 0 0 1 30 0v24Z" fill="#fbf5e6" />
        {/* Tail buildings */}
        <rect x="1260" y="76" width="40" height="44" />
        <rect x="1310" y="60" width="28" height="60" />
        <rect x="1348" y="84" width="92" height="36" />
      </svg>
    </div>
  );
}

/** Redesigned footer: skyline silhouette band over cream, then the tan
 *  panel — serif brand headings, brand-filled square socials, Explore +
 *  Policies side by side with Visit Us below on mobile (per the design),
 *  four columns from md. */
export function Footer() {
  return (
    <footer className="hide-in-app text-foreground bg-[#ded2b4]">
      <Skyline />
      <div className="mx-auto max-w-[1192px] px-6 pt-8 pb-8 md:px-4 md:pt-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_1fr_1fr_1.4fr] md:gap-y-10">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/brand/marzi-logo.png"
              alt="Marzi"
              width={140}
              height={48}
              className="h-9 w-auto"
            />
            <p className="text-foreground/60 mt-4 max-w-[280px] text-sm">
              Empowering Generation Evergreen with meaningful connections and
              curated experiences.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={name}
                  className="bg-brand hover:bg-brand-deep flex size-9 items-center justify-center rounded-lg text-white transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <nav>
            <p className="font-display text-brand text-lg font-bold">Explore</p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] md:text-sm">
              {EXPLORE.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-brand transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="font-display text-brand text-lg font-bold">
              Policies
            </p>
            <ul className="mt-3.5 space-y-2.5 text-[13px] md:text-sm">
              {POLICIES.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-foreground/80 hover:text-brand transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-brand text-lg font-bold">
              Visit Us
            </p>
            <p className="text-foreground/70 mt-3.5 max-w-[240px] text-[13px] italic md:text-sm">
              22, HARA CHAMBER, 3rd Floor, KH Road, Shantinagar, Bengaluru —
              560027
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-1.5 border-t border-black/15 pt-6 text-center sm:flex-row sm:text-left md:mt-12">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase">
            Marzi Agetech Private Limited
          </p>
          <p className="text-foreground/55 text-xs">
            © 2026 Marzi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
