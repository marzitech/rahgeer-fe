import Image from "next/image";
import { Sparkle } from "lucide-react";
import { TalkToMitrButton } from "./TalkToMitrButton";

/** "Have a group? Plan your trip with us." — crimson band from the in-app
 *  Travel page design (custom trips pitch with a black "Talk to a Marzi
 *  Mitr" pill). App WebView only; the website doesn't have this section. */
export function GroupTripsCta() {
  return (
    <section className="show-in-app overflow-hidden bg-[#a61d52] px-5 py-10 text-white">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <span className="flex items-center gap-1.5 rounded-full border border-black/20 bg-[#fff6d6] px-4 py-1 text-sm font-bold text-[#0a0a0a]">
          <Sparkle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          CUSTOM TRIPS
          <Sparkle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        </span>

        <h2 className="font-display mt-4 text-center text-2xl leading-snug font-bold">
          <span className="text-[#f4c35a]">Have a group?</span>
          <br />
          Plan your trip with us.
        </h2>

        <div className="relative mt-6 aspect-[340/280] w-full max-w-[340px] overflow-hidden rounded-xl">
          <Image
            src="/images/home/travel-with-group.jpg"
            alt="A group of travellers on a Marzi trip"
            fill
            sizes="340px"
            className="object-cover object-bottom"
          />
        </div>

        <div className="mt-6 w-full px-2">
          {/* ring-8 stands in for the design's white/10 pill around the
              button — a real wrapper would distort once the success
              banner renders below. */}
          <TalkToMitrButton
            label="Talk to a Marzi Mitr"
            form="app-group-trips"
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#0a0a0a] py-4 text-[15px] font-semibold text-white ring-8 ring-white/10 transition hover:bg-black/80 disabled:opacity-70"
          />
        </div>
      </div>
    </section>
  );
}
