/** Eyebrow + serif heading pattern used by every home section. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p
        className={`text-sm font-semibold tracking-[0.2em] uppercase ${
          dark ? "text-gold" : "text-brand"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display mt-3 text-[28px] font-semibold text-balance md:text-4xl ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-base ${dark ? "text-white/80" : "text-foreground/60"}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
