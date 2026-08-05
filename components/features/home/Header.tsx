"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Header matching marzi-web's CURRENT production theme (Bold Fest toggled
 * off upstream in "Ui toggle off from bold fest theme"): white translucent
 * bar that condenses into a centered floating pill on scroll, original
 * logo colors, gray nav with brand underline, brand Download App button.
 */

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
          "pointer-events-auto relative mx-auto flex h-16 items-center justify-between px-6 transition-all duration-500 ease-in-out md:h-20 md:px-10",
          isScrolled
            ? "mt-4 max-w-6xl rounded-full border border-white/20 bg-white/80 shadow-lg backdrop-blur-xl"
            : "border-brand/20 mt-0 max-w-full border-b bg-white/90 shadow-sm backdrop-blur-md",
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

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group hover:text-brand relative text-sm font-bold tracking-wider text-gray-500 uppercase transition-colors focus:outline-none"
              >
                {link.label}
                <span className="bg-brand absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full" />
              </Link>
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
              className="bg-brand flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-xl"
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
