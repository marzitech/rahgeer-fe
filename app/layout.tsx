import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Manrope } from "next/font/google";
import { AppWebViewProvider } from "@/components/providers/AppWebViewProvider";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CallbackPopup } from "@/components/CallbackPopup";
import { GangadharTracker } from "@/components/GangadharTracker";
import { HashScroll } from "@/components/HashScroll";
import { NavDepthTracker } from "@/components/NavDepthTracker";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { isAppWebView } from "@/lib/app-webview";
import "./globals.css";

// The travel design system (Figma "Marzi World" → Travel): Bricolage
// Grotesque for display, Inter for body, Manrope for the small uppercase
// labels. Deliberately no serif — the earlier Playfair pairing came from
// marzi-web and is not what this design uses.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Marzi — Travel Confidently",
  description:
    "India's first dedicated travel platform for people above 50 — from planning to booking. Your Travel Mitr takes care of everything.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marzi",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2e1065",
  width: "device-width",
  initialScale: 1,
  // Zoom stays enabled — this is a product for people 50+, so pinch-zoom
  // accessibility outweighs the marginal "app-like" gain of blocking it.
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Detect the Marzi app WebView server-side so hidden chrome never renders.
  const isApp = await isAppWebView();

  return (
    <html
      lang="en"
      data-app={isApp ? "true" : undefined}
      className={`${bricolage.variable} ${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <HashScroll />
        <GangadharTracker />
        <NavDepthTracker />
        <AttributionCapture />
        <AppWebViewProvider isApp={isApp}>{children}</AppWebViewProvider>
        {/* Timed lead-capture popup — website only; app users are
            already reachable, no popup inside the WebView. */}
        {!isApp && <CallbackPopup />}
        {/* Floating WhatsApp chat — website only, same reasoning as the
            popup: app users already have in-app channels. */}
        {!isApp && <WhatsAppFloat />}
      </body>
    </html>
  );
}
