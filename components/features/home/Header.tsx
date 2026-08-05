"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Header ported from marzi-web's purple Bold Fest theme:
 * - fixed; full-width purple bar at top of page, condenses into a
 *   centered floating pill once scrolled
 * - real marzi logo (inverted to white), uppercase nav with animated
 *   underline, Bold Fest badge image, pink Download App with shine sweep
 * - wavy orange strip along the bottom edge (top state only)
 */

const BOLD_FEST_THEME_ENABLED = true;

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/meetups", label: "Meetups" },
  { href: "/contact-us", label: "Contact Us" },
];

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=marzi.app&pcampaignid=web_share";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] transition-all duration-500">
      <header
        className={cn(
          "pointer-events-auto relative mx-auto flex h-16 items-center justify-between overflow-hidden px-6 transition-all duration-500 ease-in-out md:h-20 md:px-10",
          isScrolled
            ? "bg-marzi-purple/95 mt-4 max-w-6xl rounded-full border border-white/10 shadow-lg backdrop-blur-xl"
            : "bg-marzi-purple mt-0 max-w-full shadow-sm",
        )}
      >
        {/* Wavy festive strip along the bottom edge — top state only */}
        {!isScrolled && (
          <svg
            aria-hidden
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 w-full"
          >
            <defs>
              <pattern
                id="festiveHeaderStrip"
                width="20"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 2 6 C 5 6, 7 3, 10 3 C 13 3, 15 6, 18 6 C 15 6, 13 9, 10 9 C 7 9, 5 6, 2 6 Z"
                  fill="#ef8f22"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#festiveHeaderStrip)" />
          </svg>
        )}

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
                "h-8 w-auto brightness-0 invert transition-all",
                isScrolled ? "sm:h-9" : "sm:h-11",
              )}
            />
            <div className="flex items-center gap-2">
              <div
                className={cn("w-px bg-white/30", isScrolled ? "h-5" : "h-6")}
              />
              <span className="text-marzi-gold font-display text-lg font-bold tracking-tight md:text-xl">
                Travel
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-bold tracking-wider text-white/80 uppercase transition-colors hover:text-white focus:outline-none"
              >
                {link.label}
                <span className="bg-marzi-gold absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {BOLD_FEST_THEME_ENABLED && (
            <div className="hidden items-center gap-3 sm:flex md:gap-4">
              <Image
                src="/images/bold-fest-header.png"
                alt="B.OLD FEST — 10 July to 31 July"
                width={800}
                height={480}
                priority
                className="h-11 w-auto md:h-14"
              />
              <div className="h-8 w-px bg-white/30" />
            </div>
          )}

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "bg-marzi-pink group relative hidden items-center gap-2 overflow-hidden rounded-full py-2.5 text-sm font-bold text-white transition-all sm:flex",
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
            className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="pointer-events-auto mx-4 mt-2 rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-lg lg:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="hover:text-brand text-lg font-bold text-gray-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-marzi-pink flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-xl"
            >
              <Download className="h-5 w-5" />
              Download the App
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
