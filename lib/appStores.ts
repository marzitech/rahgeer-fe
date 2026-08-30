/**
 * Store listings for the Marzi app — mirrors marzi-web's lib/appStores.ts so
 * the Download App flow behaves identically on the Travel sub-site.
 */

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=marzi.app&pcampaignid=web_share";
export const APP_STORE_URL = "https://apps.apple.com/in/app/marzi/id6779118645";

/**
 * The QR encodes marzi.life/get-app rather than a store link directly, so one
 * code serves both platforms: that page sniffs the scanning device and
 * forwards iOS to the App Store and Android to the Play Store. Absolute URL —
 * the scanner is a different device, so a relative path would go nowhere.
 */
export const QR_TARGET_URL = "https://marzi.life/get-app?utm_source=travel_web_qr";
