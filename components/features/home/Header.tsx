"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
} from "lucide-react";
import { PLAY_STORE_URL } from "@/lib/appStores";
import { cn } from "@/lib/utils";

/**
 * Header matching marzi-web's CURRENT production theme (Bold Fest toggled
 * off upstream in "Ui toggle off from bold fest theme"): white translucent
 * bar that condenses into a centered floating pill on scroll, original
 * logo colors, gray nav with brand underline, brand Download App button.
 */

// The brand nav points at the main marzi.life site (this is the Travel
// sub-site); the logo + bottom tab bar keep the travel home.
const MARZI_SITE = "https://marzi.life";

const NAV_LINKS = [
  { href: MARZI_SITE, label: "Home" },
  { href: `${MARZI_SITE}/about-us`, label: "About Us" },
  { href: `${MARZI_SITE}/events`, label: "Meetups" },
  { href: `${MARZI_SITE}/contact-us`, label: "Contact Us" },
];


/* QR modal loads on demand — qrcode.react stays out of the initial bundle. */
const DownloadAppModal = dynamic(
  () =>
    import("@/components/features/home/DownloadAppModal").then(
      (m) => m.DownloadAppModal,
    ),
  { ssr: false },
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  /* Same behaviour as marzi-web's header: Android goes straight to the
     Play Store; desktop/iOS get the QR modal with both store buttons. */
  function handleDownloadClick() {
    const isAndroid =
      typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.open(PLAY_STORE_URL, "_blank");
      return;
    }
    setQrModalOpen(true);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="hide-in-app pointer-events-none fixed inset-x-0 top-0 z-[100] bg-white/90 [padding-top:env(safe-area-inset-top)] backdrop-blur-md transition-all duration-500 md:bg-transparent md:[padding-top:0] md:backdrop-blur-none">
        <header
          className={cn(
            "pointer-events-auto relative mx-auto transition-all duration-500 ease-in-out",
            // Below lg the bar is two rows — logo and Download App, then the
            // nav — because five links plus a button will not fit beside a
            // logo on a phone. From lg the nav moves up beside the logo and
            // the scroll-reactive floating pill comes back.
            "border-brand/20 border-b bg-white/90 shadow-sm backdrop-blur-md",
            isScrolled
              ? "lg:mt-4 lg:max-w-6xl lg:rounded-full lg:border lg:border-white/20 lg:bg-white/80 lg:shadow-lg lg:backdrop-blur-xl"
              : "lg:mt-0 lg:max-w-full",
          )}
        >
          <div className="flex h-16 items-center justify-between px-5 lg:h-20 lg:px-10">
            <div className="flex items-center gap-4 lg:gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Image
                  src="/images/brand/marzi-logo.png"
                  alt="Marzi"
                  width={140}
                  height={48}
                  priority
                  className={cn(
                    "h-8 w-auto transition-all",
                    isScrolled ? "sm:h-9" : "sm:h-11",
                  )}
                />
                <div className="hidden items-center gap-2 lg:flex">
                  <div
                    className={cn(
                      "w-px bg-gray-300",
                      isScrolled ? "h-5" : "h-6",
                    )}
                  />
                  <span className="text-brand font-display text-lg font-bold tracking-tight lg:text-xl">
                    Travel
                  </span>
                </div>
              </Link>

              {/* Desktop nav — brand-site links (marzi.life) */}
              <nav className="hidden items-center gap-6 lg:flex">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group hover:text-brand relative text-sm font-bold tracking-wider text-gray-500 uppercase transition-colors focus:outline-none"
                  >
                    {link.label}
                    <span className="bg-brand absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full" />
                  </a>
                ))}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleDownloadClick}
              className={cn(
                "bg-brand group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-4 py-2.5 text-sm font-bold text-white transition-all",
                isScrolled ? "lg:px-4 lg:shadow-lg lg:hover:px-6" : "lg:px-6",
              )}
            >
              <Download className="h-4 w-4" />
              <span>Download App</span>
              {/* Shine sweep */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </button>
          </div>

          {/* Second row, below lg. Scrolls rather than wraps so a narrow
            phone or a longer label can never push the bar taller than the
            height every page pads for. */}
          <nav className="flex h-11 [scrollbar-width:none] items-center gap-4 overflow-x-auto px-5 lg:hidden [&::-webkit-scrollbar]:hidden">
            <Link
              href="/"
              aria-current="page"
              className="text-brand shrink-0 text-xs font-bold tracking-wide uppercase"
            >
              Travel
            </Link>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-brand shrink-0 text-xs font-bold tracking-wide text-gray-500 uppercase transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>
      </div>

      {qrModalOpen ? (
        <DownloadAppModal onClose={() => setQrModalOpen(false)} />
      ) : null}
    </>
  );
}
