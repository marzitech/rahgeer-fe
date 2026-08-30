import { cn } from "@/lib/utils";

/** Cream "✦ EYEBROW ✦" pill used by the redesigned home sections
 *  (Meet Your Marzi Mitr, Group Tours, Marzi Advantages). */
export function SparkleChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[#fdf3d4] px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-[#442c00] uppercase shadow-sm",
        className,
      )}
    >
      <span aria-hidden className="text-gold">
        ✦
      </span>
      {label}
      <span aria-hidden className="text-gold">
        ✦
      </span>
    </span>
  );
}
