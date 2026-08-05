import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TESTIMONIALS = [
  {
    name: "Kavita Rao",
    location: "Bengaluru",
    quote:
      "The trip was well-planned, organised and full of warm people. I could simply relax and enjoy the experience.",
    hasPhoto: true,
  },
  {
    name: "Amita Sharma",
    location: "Delhi",
    quote:
      "The trip was well paced, organised and full of warm people. I would gladly travel with Marzi again.",
    hasPhoto: false,
  },
  {
    name: "Rajeev Sethi",
    location: "Mumbai",
    quote:
      "The team handled the planning so well that I could focus entirely on enjoying the journey.",
    hasPhoto: true,
  },
  {
    name: "Meera Kapoor",
    location: "Pune",
    quote:
      "Thoughtfully planned and always keen to help. Booked my parents' trip and they came back smiling.",
    hasPhoto: false,
  },
];

function Stars() {
  return (
    <div className="text-gold" aria-label="5 star rating">
      ★★★★★
    </div>
  );
}

/** "Trusted by travellers. Recommended by families." — testimonial cards. */
export function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1192px] px-4">
        <SectionHeading
          eyebrow="Reviews"
          title="Trusted by travellers. Recommended by families."
        />

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="bg-cream break-inside-avoid rounded-2xl border border-black/10 p-6"
            >
              <Stars />
              {testimonial.hasPhoto ? (
                <ImagePlaceholder
                  label={`Trip photo — ${testimonial.name}`}
                  className="mt-4 h-40 w-full rounded-xl"
                />
              ) : null}
              <blockquote className="text-foreground/80 mt-4 text-sm">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <ImagePlaceholder className="size-10 rounded-full" />
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-foreground/50 text-xs">
                    Traveler · {testimonial.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
