"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Phone, Sparkles } from "lucide-react";

/** Native-style bottom tab bar — mobile only (hidden from md up, and in
 *  print). Fixed to the bottom, safe-area aware, with an active pill so the
 *  site reads as an app on phones. */

const TABS = [
  { href: "/", label: "Home", Icon: Home, match: (p: string) => p === "/" },
  {
    href: "/#destinations",
    label: "Explore",
    Icon: Compass,
    match: (p: string) => p.startsWith("/destinations"),
  },
  {
    href: "/plan/ai",
    label: "Plan",
    Icon: Sparkles,
    match: (p: string) => p.startsWith("/plan"),
  },
  {
    href: "/#plan-your-trip",
    label: "Call",
    Icon: Phone,
    match: () => false,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 [padding-bottom:env(safe-area-inset-bottom)] backdrop-blur-md md:hidden print:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-brand" : "text-foreground/55"
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
                    active ? "bg-brand/10" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
