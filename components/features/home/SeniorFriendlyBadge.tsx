import { Info } from "lucide-react";

const DIAL_RADIUS = 30;
const DIAL_LENGTH = Math.PI * DIAL_RADIUS; // semicircle arc length

/** White chip with the semicircular "Senior Friendly" score dial that
 *  floats over the redesigned destination/tour card photos. Green from
 *  80% up, amber below (per the design's 78% card). */
export function SeniorFriendlyBadge({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#2fa75f" : "#e8890c";

  return (
    <div className="relative rounded-2xl bg-white px-3 pt-3 pb-2 text-center shadow-md">
      <Info
        aria-hidden
        className="absolute top-1.5 right-1.5 h-3 w-3 text-gray-400"
      />
      <div className="relative mx-auto h-[34px] w-[64px]">
        <svg viewBox="0 0 72 38" className="absolute inset-0 size-full">
          <path
            d="M6 36 A30 30 0 0 1 66 36"
            fill="none"
            stroke="#eee8df"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M6 36 A30 30 0 0 1 66 36"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={DIAL_LENGTH}
            strokeDashoffset={DIAL_LENGTH * (1 - pct / 100)}
          />
        </svg>
        <span className="text-foreground absolute inset-x-0 bottom-0 text-[15px] leading-none font-bold">
          {pct}
          <span className="align-top text-[9px]">%</span>
        </span>
      </div>
      <p className="text-foreground mt-1 text-[10px] leading-none font-bold">
        Senior Friendly
      </p>
    </div>
  );
}
