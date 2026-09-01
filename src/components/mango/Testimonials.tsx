import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Dhaka",
    rating: 5,
    quote:
      "The Himsagar box arrived still smelling of the orchard. My kids finished half of it before dinner.",
  },
  {
    name: "Arjun Mehta",
    role: "Mumbai",
    rating: 5,
    quote:
      "I've ordered Alphonso online for years — this is the first time every single mango ripened evenly.",
  },
  {
    name: "Farhana Kabir",
    role: "Chattogram",
    rating: 4,
    quote:
      "Packaging is beautiful and the pricing is honest. The banner builder was a fun surprise for my shop.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep">
              Loved by mango people
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl">
              What our customers say
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="h-full rounded-3xl border border-border bg-card p-7 transition-transform hover:-translate-y-1">
                <Quote className="size-7 text-mango" />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/80">
                  “{t.quote}”
                </blockquote>
                <div className="mt-5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`size-4 ${s < t.rating ? "fill-mango text-mango" : "text-border"}`}
                    />
                  ))}
                </div>
                <figcaption className="mt-3 text-sm font-semibold text-secondary">
                  {t.name}
                  <span className="ml-2 font-normal text-muted-foreground">{t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
