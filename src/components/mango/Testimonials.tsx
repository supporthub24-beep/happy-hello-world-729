import { BadgeCheck, Flame, Quote, Star, Timer } from "lucide-react";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Dhaka",
    rating: 5,
    quote:
      "The Himsagar box arrived still smelling of the orchard. My kids finished half of it before dinner — I had to hide the rest.",
  },
  {
    name: "Arjun Mehta",
    role: "Mumbai",
    rating: 5,
    quote:
      "I've ordered Alphonso online for years — this is the first time every single mango ripened evenly. I've already reordered twice this season.",
  },
  {
    name: "Farhana Kabir",
    role: "Chattogram",
    rating: 5,
    quote:
      "Packaging is beautiful and the pricing is honest. The banner builder was a fun surprise for my shop — my customers keep asking where I get my mangoes.",
  },
];

const proof = [
  { icon: Star, label: "৪.৯ / ৫ গড় রেটিং" },
  { icon: BadgeCheck, label: "২,৪০০+ ভেরিফায়েড অর্ডার" },
  { icon: Flame, label: "৯২% রিপিট কাস্টমার" },
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
              ২,৪০০+ পরিবার আর অন্য কোথাও আম কেনে না
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-secondary/90 drop-shadow-sm md:text-base">
              একবার আমাদের আম খেলে সুপারমার্কেটের আম আর অপশন থাকে না — এটাই আমাদের সবচেয়ে বড় প্রমাণ।
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {proof.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-2 rounded-full border border-mango/40 bg-mango/10 px-4 py-2 text-xs font-semibold text-mango-deep shadow-sm backdrop-blur-sm"
                >
                  <p.icon className="size-4" aria-hidden="true" />
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="group relative h-full overflow-hidden rounded-3xl border border-white/30 bg-white/80 p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-mango/50 hover:bg-white/90 hover:shadow-2xl hover:shadow-mango/20 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15">
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

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-mango/40 bg-white/70 p-7 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10 md:flex-row md:justify-between md:text-left">
            <div>
              <p className="inline-flex items-center gap-2 font-display text-xl font-semibold text-secondary drop-shadow-sm md:text-2xl">
                <Timer className="size-5 text-mango-deep" aria-hidden="true" />
                সীমিত স্টক · আজই শেষ হতে পারে
              </p>
              <p className="mt-1.5 text-sm font-medium text-muted-foreground">
                মৌসুম শেষ হওয়ার আগেই আপনার ক্রেট বুক করুন — ডেলিভারি ২৪ ঘণ্টায় ডিসপ্যাচ।
              </p>
            </div>
            <a
              href="#varieties"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-mango to-mango-deep px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_32px_rgba(255,140,0,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,140,0,0.6)]"
            >
              এখনই অর্ডার করুন
              <Flame className="size-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
