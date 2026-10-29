/**
 * This site is a zone of marzi.life, mounted at /holidays via Next's
 * `basePath` (next.config.ts). marzi-web proxies `/holidays/*` to this
 * deployment, so the browser only ever sees marzi.life.
 *
 * next/link, next/image, router.push and the config rewrites add the prefix
 * on their own. Anything that is a plain string does NOT: CSS `url()`,
 * `fetch("/api/...")`, the PWA manifest, metadata icon paths, canonicals.
 * Those go through here, so the prefix lives in exactly one place.
 */
export const BASE_PATH = "/holidays";

/** Public origin the zone is reached from. Canonicals and the sitemap use it. */
export const PUBLIC_ORIGIN = "https://marzi.life";

/** `/images/x.png` → `/holidays/images/x.png`. Absolute and already-prefixed URLs pass through. */
export function withBasePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** `/packages/ladakh` → `https://marzi.life/holidays/packages/ladakh`; `/` → `https://marzi.life/holidays`. */
export function canonicalUrl(path: string): string {
  const prefixed = withBasePath(path).replace(/\/$/, "");
  return `${PUBLIC_ORIGIN}${prefixed}`;
}

/**
 * next/image does NOT apply basePath to `src`. It prefixes the optimizer
 * endpoint (`/holidays/_next/image?url=...`) but passes the `url` through
 * verbatim, and the optimizer then 400s on `/images/...` because the public
 * folder is only served under /holidays. Every <Image> goes through
 * components/ui/Image.tsx, which runs its src through here.
 */
export function imageSrc<T>(src: T): T {
  return (typeof src === "string" ? withBasePath(src) : src) as T;
}
