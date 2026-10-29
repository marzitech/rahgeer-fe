/**
 * This site is served two ways from one repo:
 *
 *  - as a zone of marzi.life, mounted at /holidays (the primary; marzi-web
 *    proxies `/holidays/*` to the `rahgeer-fe` Vercel project), and
 *  - at the root of holidays.marzi.life (a second Vercel project with
 *    NEXT_PUBLIC_BASE_PATH="/"), kept only until the mobile app's WebView
 *    is released pointing at the new URL.
 *
 * The mount point is NEXT_PUBLIC_BASE_PATH, read here AND in next.config.ts
 * (Next's `basePath`), so one build serves one mount point. next/link,
 * next/image's endpoint, router.push and the config rewrites add the prefix
 * on their own. Anything that is a plain string does NOT: CSS `url()`,
 * `fetch("/api/...")`, the PWA manifest, metadata icon paths, next/image
 * `src`. Those go through here.
 */

/** Unset → the zone. "/" or "" → the root. Trailing slash dropped, leading slash added. */
export function resolveBasePath(raw: string | undefined): string {
  if (raw === undefined) return "/holidays";
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (trimmed === "") return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export const BASE_PATH = resolveBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

/** Public origin + mount point of the canonical copy. Never varies by build. */
export const PUBLIC_ORIGIN = "https://marzi.life";
const CANONICAL_BASE_PATH = "/holidays";

/** `prefixPath("/holidays", "/images/x.png")` → `/holidays/images/x.png`. Absolute and already-prefixed URLs pass through. */
export function prefixPath(prefix: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const rooted = path.startsWith("/") ? path : `/${path}`;
  if (prefix === "" || rooted === prefix || rooted.startsWith(`${prefix}/`))
    return rooted;
  return `${prefix}${rooted}`;
}

/** Apply this build's mount point to a root-relative path. */
export function withBasePath(path: string): string {
  return prefixPath(BASE_PATH, path);
}

/**
 * `/packages/ladakh` → `https://marzi.life/holidays/packages/ladakh`.
 * Deliberately NOT the build's own mount point: the subdomain build must
 * declare the zone as canonical so search engines treat it as a duplicate.
 */
export function canonicalUrl(path: string): string {
  const prefixed = prefixPath(CANONICAL_BASE_PATH, path).replace(/\/$/, "");
  return `${PUBLIC_ORIGIN}${prefixed}`;
}

/**
 * next/image does NOT apply basePath to `src`. It prefixes the optimizer
 * endpoint (`/holidays/_next/image?url=...`) but passes the `url` through
 * verbatim, and the optimizer then 400s on `/images/...` because the public
 * folder is only served under the mount point. Every <Image> goes through
 * components/ui/Image.tsx, which runs its src through here.
 */
export function imageSrc<T>(src: T): T {
  return (typeof src === "string" ? withBasePath(src) : src) as T;
}
