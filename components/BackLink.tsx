"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasInAppHistory } from "@/lib/navDepth";

/** Back affordance that behaves like the browser's Back button when the
 *  visitor navigated here from within the site — a true history back, so
 *  the previous page returns with its scroll position and state intact.
 *  Deep links / new tabs (no in-app history) follow `href` instead. */
export function BackLink({
  href,
  className,
  children,
}: {
  /** Fallback destination when there is no in-app history to return to. */
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (hasInAppHistory()) {
          e.preventDefault();
          router.back();
        }
      }}
    >
      {children}
    </Link>
  );
}
