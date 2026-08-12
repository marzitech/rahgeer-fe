import { headers } from "next/headers";

/**
 * User-Agent token the Marzi app appends via
 * `applicationNameForUserAgent={"MarziApp/1.0"}` on its WebView. It's
 * appended to (not replacing) the default UA, so existing browser/OS
 * sniffing keeps working.
 */
export const APP_UA_TOKEN = "MarziApp";

/**
 * True when the request comes from the Marzi app's WebView — resolved
 * server-side from the UA header, so hidden chrome never renders (no
 * hydration flash).
 *
 * Reading the header opts the route into dynamic rendering. If a page must
 * stay static, do the sniff in `middleware.ts` and rewrite/set a cookie
 * instead (see the note in the PR).
 */
export async function isAppWebView(): Promise<boolean> {
  const ua = (await headers()).get("user-agent") ?? "";
  return ua.includes(APP_UA_TOKEN);
}
