"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Compass,
  Download,
  Home,
  Info,
  Menu,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
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

// The mobile drawer mixes travel-app routes (internal) with brand-site links
// (external, marked so they render a plain anchor).
const MENU_ITEMS = [
  { href: "/", label: "Home", Icon: Home, external: false },
  {
    href: "/#destinations",
    label: "Explore Destinations",
    Icon: Compass,
    external: false,
  },
  {
    href: "/plan/ai",
    label: "Plan a Trip with AI",
    Icon: Sparkles,
    external: false,
  },
  {
    href: `${MARZI_SITE}/about-us`,
    label: "About Us",
    Icon: Info,
    external: true,
  },
  {
    href: `${MARZI_SITE}/events`,
    label: "Meetups",
    Icon: Users,
    external: true,
  },
  {
    href: `${MARZI_SITE}/contact-us`,
    label: "Contact Us",
    Icon: Phone,
    external: true,
  },
];

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=marzi.app&pcampaignid=web_share";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock the page behind the drawer + close it on Escape.
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
            "pointer-events-auto relative mx-auto flex h-16 items-center justify-between px-6 transition-all duration-500 ease-in-out md:h-20 md:px-10",
            // Mobile: always a solid, full-width fixed bar (app-like — no
            // shrinking pill). md+: restore the scroll-reactive floating pill.
            "border-brand/20 border-b bg-white/90 shadow-sm backdrop-blur-md",
            isScrolled
              ? "md:mt-4 md:max-w-6xl md:rounded-full md:border md:border-white/20 md:bg-white/80 md:shadow-lg md:backdrop-blur-xl"
              : "md:mt-0 md:max-w-full",
          )}
        >
          <div className="flex items-center gap-4 md:gap-8">
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
              <div className="flex items-center gap-2">
                <div
                  className={cn("w-px bg-gray-300", isScrolled ? "h-5" : "h-6")}
                />
                <span className="text-brand font-display text-lg font-bold tracking-tight md:text-xl">
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

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "bg-brand group relative hidden items-center gap-2 overflow-hidden rounded-full py-2.5 text-sm font-bold text-white transition-all sm:flex",
                isScrolled ? "px-4 shadow-lg hover:px-6" : "px-6",
              )}
            >
              <Download className="h-4 w-4" />
              <span>Download App</span>
              {/* Shine sweep */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </a>

            {/* Mobile menu trigger — 44px min tap target */}
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((open) => !open)}
              className="text-foreground relative z-[1] flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile drawer — full-height slide-in panel (app-style). Sibling of
          the header (NOT inside it) so its `fixed` positioning resolves to
          the viewport, not the header's backdrop-blur containing block. */}
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
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[84%] max-w-sm flex-col bg-white [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/brand/marzi-logo.png"
                alt="Marzi"
                width={110}
                height={38}
                className="h-8 w-auto"
              />
              <span className="h-5 w-px bg-gray-300" />
              <span className="text-brand font-display text-lg font-bold">
                Travel
              </span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="text-foreground flex h-10 w-10 items-center justify-center rounded-full bg-black/5 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav rows */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {MENU_ITEMS.map(({ href, label, Icon, external }) => {
              const active =
                external || href.includes("#")
                  ? false
                  : href === "/"
                    ? pathname === "/"
                    : href.startsWith("/plan")
                      ? pathname.startsWith("/plan")
                      : pathname === href;
              const rowClass = cn(
                "group flex items-center gap-3.5 rounded-2xl px-3 py-3.5 transition active:scale-[0.98]",
                active ? "bg-brand/5" : "hover:bg-black/[0.03]",
              );
              const inner = (
                <>
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition",
                      active ? "bg-brand text-white" : "bg-brand/10 text-brand",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[15px] font-semibold",
                      active ? "text-brand" : "text-gray-800",
                    )}
                  >
                    {label}
                  </span>
                  <ChevronRight className="text-foreground/30 h-4 w-4" />
                </>
              );
              return external ? (
                <a
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={rowClass}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={rowClass}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* Drawer footer CTA */}
          <div className="border-t border-black/5 p-4">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-brand flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-lg active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Download the App
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
