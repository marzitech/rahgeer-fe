import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";

/** Global 404 — shown for unknown URLs and notFound() throws (unknown
 *  destination/plan slugs). Keeps the site chrome so the visitor always
 *  has a way back into the journey. */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-[#fdf7f2] pt-20 md:pt-24">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <span aria-hidden className="text-4xl">
            🧭
          </span>
          <h1 className="font-display text-brand mt-4 text-2xl font-bold">
            This page has wandered off
          </h1>
          <p className="text-foreground/70 mt-3 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved. Your Travel Mitr can still plan any trip you have in mind.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="text-brand inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Travel
            </Link>
            <Link
              href="/#plan-your-trip"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
