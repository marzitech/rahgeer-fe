/**
 * When the "Want us to call you?" popup may appear.
 *
 * Once per session, on the first page the visitor lands on, and not
 * again until the session ends. The old rule restarted on every
 * navigation and only a *submitted* number silenced it, so someone who
 * closed it on the home page met it again on the next page, and the next.
 * Seen once is the promise, whatever they did with it.
 *
 * sessionStorage is the right memory for that promise: it clears when
 * the session ends, so a return visit is offered the callback once more.
 */

const SHOWN_KEY = "marzi_callback_popup_shown";

/** The two methods we use, so a test can hand in a plain object. */
type ShownStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * Every page except the enquiry page, which *is* the lead form — a
 * callback prompt over it would be asking twice.
 */
export function isCallbackEligible(pathname: string): boolean {
  return !(pathname === "/enquiry" || pathname.startsWith("/enquiry/"));
}

/**
 * Both tolerate a storage that throws (private windows, blocked site
 * data): the popup is decoration and must never take the page down.
 * Failing to remember means at worst it shows again, which is the old
 * behaviour, not a broken one.
 */
export function wasCallbackShown(storage: ShownStorage): boolean {
  try {
    return storage.getItem(SHOWN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCallbackShown(storage: ShownStorage): void {
  try {
    storage.setItem(SHOWN_KEY, "1");
  } catch {
    // Best effort — see above.
  }
}
