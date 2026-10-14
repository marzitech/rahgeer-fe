import { revalidatePath } from "next/cache";

/**
 * Drop the cached travel pages so an edit in the admin shows straight away.
 *
 * Without this, a change waits out two sixty-second windows — the page's own
 * `revalidate` and the cached fetch behind it — and in the meantime the home
 * page can serve its fallback banner, which looks enough like real content
 * that it reads as "my change did not save" rather than "this is stale".
 *
 * Called by admin-v2 after any travel write. Best-effort on that side: if
 * this is unreachable the site still self-heals on its own timer.
 */

/** Everything a travel edit can change. */
const PATHS: [path: string, type?: "page" | "layout"][] = [
  ["/"], // hero banners, features, the trips rail, FAQs, Travel Mitrs
  ["/packages"], // the listing
  ["/packages/[slug]", "page"], // every tour page — the pattern, not one slug
];

export async function POST(request: Request) {
  const secret = process.env.TRAVEL_REVALIDATE_SECRET;

  // Fail closed. An unset secret must not mean "anyone may clear the cache".
  if (!secret) {
    return Response.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Bad secret." }, { status: 401 });
  }

  for (const [path, type] of PATHS) {
    revalidatePath(path, type);
  }

  return Response.json({ revalidated: PATHS.map(([path]) => path) });
}
