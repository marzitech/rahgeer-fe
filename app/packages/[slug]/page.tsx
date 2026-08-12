import { notFound } from "next/navigation";
import { Faq } from "@/components/features/home/Faq";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { PackageDetail } from "@/components/features/packages/PackageDetail";
import { PACKAGE_CONTENT } from "@/lib/content/packages";

/** Curated package page — reached from "View packages" on a Curated Trip. */

export function generateStaticParams() {
  return Object.keys(PACKAGE_CONTENT).map((slug) => ({ slug }));
}

export default async function PackagePage({
  params,
}: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = PACKAGE_CONTENT[slug];
  if (!pkg) notFound();

  return (
    <>
      <Header />
      <PackageDetail pkg={pkg} />
      <Faq />
      <Footer />
    </>
  );
}
