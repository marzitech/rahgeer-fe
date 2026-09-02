/**
 * Logged-in user details handed over by the Marzi app's WebView.
 *
 * Contract with the React Native app — inject BEFORE content load so the
 * value exists by the time any button is tappable:
 *
 *   <WebView
 *     applicationNameForUserAgent="MarziApp/1.0"
 *     injectedJavaScriptBeforeContentLoaded={
 *       `window.MarziAppUser=${JSON.stringify({
 *         fullName: user.name,
 *         phone: user.phone,     // any format; backend normalizes to E.164
 *         dob: user.dob,         // "YYYY-MM-DD"
 *       })};true;`
 *     }
 *   />
 *
 * Older app builds don't inject this — callers must treat null as "fall
 * back to the /enquiry form".
 */

export interface AppUser {
  fullName: string;
  phone: string;
  dob?: string;
}

declare global {
  interface Window {
    MarziAppUser?: unknown;
  }
}

/** The injected user, or null when absent/malformed (old app builds, web). */
export function getAppUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  let raw = window.MarziAppUser;

  // Dev-only test seed — console globals die on reload, so local testing
  // uses localStorage instead. Set once in DevTools:
  //   localStorage.MarziAppUserDev = JSON.stringify({
  //     fullName: "Test User", phone: "9876543210", dob: "1960-05-01" })
  if (raw === undefined && process.env.NODE_ENV === "development") {
    try {
      const seed = window.localStorage.getItem("MarziAppUserDev");
      if (seed) raw = JSON.parse(seed);
    } catch {
      // ignore — no seed, malformed JSON, or storage unavailable
    }
  }
  if (typeof raw !== "object" || raw === null) return null;
  const { fullName, phone, dob } = raw as Record<string, unknown>;
  if (typeof fullName !== "string" || fullName.trim() === "") return null;
  if (typeof phone !== "string" || phone.trim() === "") return null;
  return {
    fullName: fullName.trim().slice(0, 120),
    phone: phone.trim().slice(0, 32),
    dob: typeof dob === "string" && dob.trim() !== "" ? dob.trim() : undefined,
  };
}

/** Age in whole years from an ISO "YYYY-MM-DD" DOB; null when unparseable
 *  or outside the backend's accepted 1–120 range. */
export function ageFromDob(dob: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const now = new Date();
  let age = now.getFullYear() - year;
  if (
    now.getMonth() + 1 < month ||
    (now.getMonth() + 1 === month && now.getDate() < day)
  ) {
    age -= 1;
  }
  return age >= 1 && age <= 120 ? age : null;
}
