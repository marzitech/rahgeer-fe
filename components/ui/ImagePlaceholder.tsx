/**
 * Stand-in for Figma image assets that couldn't be exported yet (Figma MCP
 * quota — see components/features/home/ASSETS.md). Renders a branded
 * gradient so layouts read correctly; swap for next/image when assets land.
 */
export function ImagePlaceholder({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`from-marzi-purple via-brand to-brand-deep relative overflow-hidden bg-gradient-to-br ${className}`}
    >
      {label ? (
        <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] font-medium tracking-wide text-white/40 uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}
