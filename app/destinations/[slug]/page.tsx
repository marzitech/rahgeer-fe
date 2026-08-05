import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/features/home/Footer";
import { Header } from "@/components/features/home/Header";
import { PackageList } from "./PackageList";

/**
 * Destination packages page — reached from the home destination cards
 * ("Starting from" badge / "View packages").
 *
 * NOTE: working shell. The final UI comes from Figma node 3541-27094 —
 * blocked by the Figma MCP quota; rebuild this page against the design
 * export when available.
 */

const DESTINATIONS: Record<
  string,
  { name: string; image: string; priceFromInr?: number }
> = {
  europe: {
    name: "Europe",
    image: "/images/destinations/europe.jpg",
    priceFromInr: 56302,
  },
  kashmir: {
    name: "Kashmir",
    image: "/images/destinations/kashmir.jpg",
    priceFromInr: 56302,
  },
  japan: { name: "Japan", image: "/images/destinations/japan.jpg" },
  kerala: { name: "Kerala", image: "/images/destinations/kerala.jpg" },
  vietnam: { name: "Vietnam", image: "/images/destinations/vietnam.jpg" },
  rajasthan: { name: "Rajasthan", image: "/images/destinations/rajasthan.jpg" },
};

export function generateStaticParams() {
  return Object.keys(DESTINATIONS).map((slug) => ({ slug }));
}

export default async function DestinationPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = DESTINATIONS[slug];
  if (!destination) notFound();

  return (
    <>
      <Header />
      <main>
        {/* Destination hero band */}
        <section className="relative flex h-[320px] items-end overflow-hidden md:h-[400px]">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="relative mx-auto w-full max-w-[1192px] px-4 pt-28 pb-10">
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              {destination.name} Packages
            </h1>
            {destination.priceFromInr ? (
              <p className="mt-2 text-white/85">
                Starting from{" "}
                <span className="text-gold font-bold">
                  ₹{destination.priceFromInr.toLocaleString("en-IN")}
                </span>
              </p>
            ) : null}
          </div>
        </section>

        <PackageList destinationName={destination.name} />
      </main>
      <Footer />
    </>
  );
}
