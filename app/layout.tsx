import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { AppWebViewProvider } from "@/components/providers/AppWebViewProvider";
import { AttributionCapture } from "@/components/AttributionCapture";
import { HashScroll } from "@/components/HashScroll";
import { NavDepthTracker } from "@/components/NavDepthTracker";
import { isAppWebView } from "@/lib/app-webview";
import "./globals.css";

// Same pairing as marzi-web production: Lato body + Playfair display.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      className={`${lato.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <HashScroll />
        <NavDepthTracker />
        <AttributionCapture />
        <AppWebViewProvider isApp={isApp}>{children}</AppWebViewProvider>
      </body>
    </html>
  );
}
