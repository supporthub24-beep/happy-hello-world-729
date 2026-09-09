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
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Liquid glass background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mango-light/40 via-background to-mango/20" />
      <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-mango/30 blur-3xl" />
      <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-mango-deep/20 blur-3xl" />
      
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep drop-shadow-sm">
              Loved by mango people
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-secondary md:text-4xl drop-shadow-sm">
              What our customers say
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="group relative h-full overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-xl dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
                <div className="absolute inset-0 bg-gradient-to-br from-mango/10 via-transparent to-mango-deep/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Quote className="relative size-7 text-mango drop-shadow" />
                <blockquote className="relative mt-4 text-sm font-medium leading-relaxed text-foreground">
                  "{t.quote}"
                </blockquote>
                <div className="relative mt-5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`size-4 ${s < t.rating ? "fill-mango text-mango drop-shadow" : "text-border"}`}
                    />
                  ))}
                </div>
                <figcaption className="relative mt-3 text-sm font-semibold text-secondary">
                  {t.name}
                  <span className="ml-2 font-normal text-muted-foreground">— {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}