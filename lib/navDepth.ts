/** In-app navigation depth — lets Back affordances decide between a true
 *  history back (restores the previous page's scroll and state) and a
 *  fallback href (deep links / new tabs, where "back" would leave the site
 *  or do nothing).
 *
 *  Module state lives for the SPA session: it resets on a full page load,
 *  which is exactly when history back stops being safe. Incremented by
 *  <NavDepthTracker /> in the root layout on every route change. */

let depth = 0;

export function incrementNavDepth() {
  depth += 1;
}

/** True once at least one client-side navigation has happened, i.e. the
 *  previous history entry is one of our own pages. */
export function hasInAppHistory() {
  return depth > 0;
}
