"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Home,
  Info,
  Menu,
  Phone,
  Users,
  X,
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

// The mobile drawer mirrors the desktop navbar exactly — brand-site links
// (external, marked so they render a plain anchor).
const MENU_ITEMS = [
  { href: MARZI_SITE, label: "Home", Icon: Home, external: true },
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
  const pathname = usePathname();

  // The home page shows its nav inline, as the design draws it. Every
  // other page keeps the bar to one row and puts the same links behind a
  // hamburger — an inner page has its own content to lead with, and the
  // second row costs 45px of a phone screen on every one of them.
  const inlineNav = pathname === "/";

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

              {!inlineNav ? (
                <button
                  type="button"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen((open) => !open)}
                  className="text-foreground flex size-11 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
                >
                  {isOpen ? (
                    <X className="size-6" />
                  ) : (
                    <Menu className="size-6" />
                  )}
                </button>
              ) : null}
            </div>
          </div>

          {/* Second row, home only, below lg. Scrolls rather than wraps
            so a narrow phone or a longer label can never push the bar
            taller than the height the page pads for. */}
          {inlineNav ? (
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
          ) : null}
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
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleDownloadClick();
              }}
              className="bg-brand flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-lg active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Download the App
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
