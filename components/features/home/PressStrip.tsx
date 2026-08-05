import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** "Trusted by travellers" press-logo strip. Logos are Figma assets —
 *  placeholders until export (see ASSETS.md). */
export function PressStrip() {
  return (
    <section className="border-y border-black/5 bg-white py-10">
      <div className="mx-auto max-w-[1192px] px-4 text-center">
        <p className="text-foreground/50 text-xs font-semibold tracking-[0.25em] uppercase">
          Featured in
        </p>
        <div className="mt-6 flex items-center justify-center gap-10 overflow-hidden opacity-60">
          {["Press 1", "Press 2", "Press 3", "Press 4", "Press 5"].map(
            (label) => (
              <ImagePlaceholder
                key={label}
                label={label}
                className="h-[52px] w-[140px] shrink-0 rounded-md"
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
