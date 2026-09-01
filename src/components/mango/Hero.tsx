import { ArrowRight, Leaf, Star, Truck } from "lucide-react";
import heroMangoes from "@/assets/hero-mangoes.jpg";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-mango/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-leaf/15 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-mango/40 bg-mango/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mango-deep">
            <Leaf className="size-3.5" /> Season 2026 · আম
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-secondary sm:text-5xl md:text-6xl">
            Fresh Mangoes,{" "}
            <span className="text-mango-deep">Delivered to Your Door</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Hand-picked from family orchards, ripened naturally and shipped within 24 hours —
            no cold storage, no carbide, just pure sun-grown sweetness.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#varieties"
              className="group inline-flex items-center gap-2 rounded-full bg-mango px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-12px_rgba(255,140,0,0.85)] transition-transform hover:-translate-y-0.5"
            >
              Shop Mangoes
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#banner-builder"
              className="inline-flex items-center gap-2 rounded-full border border-secondary/25 px-7 py-3.5 text-sm font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              Try Banner Builder
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-7 text-sm">
            <div className="flex items-center gap-2 text-foreground/75">
              <Star className="size-4 fill-mango text-mango" /> 4.9 / 5 from 2,400+ orders
            </div>
            <div className="flex items-center gap-2 text-foreground/75">
              <Truck className="size-4 text-leaf-soft" /> Free delivery over ৳1500
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-mango/25 blur-2xl" />
          <img
            src={heroMangoes}
            alt="Pile of ripe golden mangoes with fresh green leaves"
            width={1200}
            height={1200}
            className="relative w-full animate-float rounded-[46%_54%_58%_42%/48%_46%_54%_52%] object-cover shadow-[0_40px_80px_-40px_rgba(45,80,22,0.55)]"
          />
          <div className="absolute -bottom-3 left-2 rounded-2xl bg-card px-5 py-3 shadow-lg sm:left-6">
            <p className="font-display text-lg font-semibold text-secondary">Farm direct</p>
            <p className="text-xs text-muted-foreground">Rajshahi &amp; Ratnagiri orchards</p>
          </div>
        </div>
      </div>
    </section>
  );
}
