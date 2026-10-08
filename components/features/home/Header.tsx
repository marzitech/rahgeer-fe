"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download, Menu, X } from "lucide-react";
import { PLAY_STORE_URL } from "@/lib/appStores";
import { cn } from "@/lib/utils";

/**
 * Header matching marzi-web's CURRENT production theme (Bold Fest toggled
 * off upstream in "Ui toggle off from bold fest theme"): white translucent
 * bar that condenses into a centered floating pill on scroll, original
 * logo colors, gray nav with brand underline, brand Download App button.
 */

// The brand nav points at the main marzi.life site (this is the Holidays
// sub-site); the logo + bottom tab bar keep the holidays home.
const MARZI_SITE = "https://marzi.life";

// The mobile menu mirrors the desktop navbar — brand-site links (external,
// marked so they render a plain anchor) — and closes with this sub-site's
// own home ("Holidays"), matching marzi-web's menu order.
const MENU_ITEMS = [
  { href: MARZI_SITE, label: "Home", external: true },
  { href: `${MARZI_SITE}/about-us`, label: "About Us", external: true },
  { href: `${MARZI_SITE}/events`, label: "Meetups", external: true },
  { href: `${MARZI_SITE}/contact-us`, label: "Contact Us", external: true },
  { href: "/", label: "Holidays" },
];

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
  const [isOpen, setIsOpen] = useState(false);
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

  // Lock the page behind the menu + close it on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      <div className="hide-in-app pointer-events-none fixed inset-x-0 top-0 z-[100] bg-white/90 [padding-top:env(safe-area-inset-top)] backdrop-blur-md transition-all duration-500 md:bg-transparent md:[padding-top:0] md:backdrop-blur-none">
        <header
          className={cn(
            "pointer-events-auto relative mx-auto transition-all duration-500 ease-in-out",
            // Below lg the bar is one row — logo, Download App, hamburger —
            // with the nav links in the full-screen menu. From lg the nav
            // sits inline beside the logo and the scroll-reactive floating
            // pill comes back.
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
                    Holidays
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadClick}
                className={cn(
                  "bg-brand group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full px-4 py-2.5 text-sm font-bold text-white transition-all",
                  isScrolled ? "lg:px-4 lg:shadow-lg lg:hover:px-6" : "lg:px-6",
                )}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download App</span>
                <span className="sm:hidden">Download</span>
                {/* Shine sweep */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </button>

              <button
                type="button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="text-foreground flex size-11 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
              >
                {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu — sheet dropping from the top over the dimmed page
          (per design mock: white panel with rounded bottom corners, plain
          rows with hairline dividers, centered pill CTA). Sibling of the
          header (NOT inside it) so its `fixed` positioning resolves to the
          viewport, not the header's backdrop-blur containing block. */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          "hide-in-app fixed inset-0 z-[110] lg:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Sheet */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-x-0 top-0 flex max-h-full flex-col overflow-y-auto rounded-b-3xl bg-white [padding-top:env(safe-area-inset-top)] shadow-2xl transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          {/* Sheet header — logo left, close right */}
          <div className="flex items-start justify-between px-6 pt-6">
            <Image
              src="/images/brand/marzi-logo.png"
              alt="Marzi"
              width={140}
              height={48}
              className="h-10 w-auto"
            />
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              className="text-foreground flex size-11 items-center justify-center active:scale-95"
            >
              <X className="size-6" strokeWidth={2} />
            </button>
          </div>

          {/* Nav rows */}
          <nav className="px-6 pt-10">
            {MENU_ITEMS.map(({ href, label, external }) => {
              const rowClass =
                "flex items-center justify-between border-b border-gray-200 py-6 transition active:opacity-60";
              const inner = (
                <>
                  <span className="text-lg font-semibold tracking-wide text-gray-800 uppercase">
                    {label}
                  </span>
                  <ChevronRight
                    className="size-5 text-gray-400"
                    strokeWidth={2}
                  />
                </>
              );
              return external ? (
                <a
                  key={label}
                  href={href}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={rowClass}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={rowClass}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* CTA — centered brand pill, as in the mock */}
          <div className="px-6 pt-10 pb-12">
            <button
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                setIsOpen(false);
                handleDownloadClick();
              }}
              className="bg-brand flex w-full items-center justify-center rounded-full py-4 text-lg font-bold text-white active:scale-[0.98]"
            >
              Download App
            </button>
          </div>
        </div>
      </div>

      {qrModalOpen ? (
        <DownloadAppModal onClose={() => setQrModalOpen(false)} />
      ) : null}
    </>
  );
}
