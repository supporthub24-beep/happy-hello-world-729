import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Star, Truck } from "lucide-react";
import { ResponsiveImage } from "./ResponsiveImage";
import freshHarvest from "@/assets/banner-fresh-harvest.jpg";
import premium from "@/assets/banner-premium.jpg";
import seasonal from "@/assets/banner-seasonal-offer.jpg";

type Slide = {
  id: string;
  image: string;
  base: string;
  alt: string;
  eyebrow: string;
  titleBn: string;
  title: string;
  subtitle: string;
  cta: string;
  badge?: string;
  overlay: string;
};

const slides: Slide[] = [
  {
    id: "fresh-harvest",
    image: freshHarvest,
    base: "banner-fresh-harvest",
    alt: "তাজা রসালো আম ও পাতা — Fresh juicy ripe mangoes with water droplets and green leaves",
    eyebrow: "Fresh Harvest · তাজা ফলন",
    titleBn: "আমের রাজ্যে স্বাগতম",
    title: "Nature's Sweetest Gift",
    subtitle: "Hand-picked at sunrise, shipped within 24 hours — no carbide, no cold storage.",
    cta: "এখনই অর্ডার করুন",
    overlay: "from-[#1A1200]/90 via-[#1A1200]/65 to-[#1A1200]/20",
  },
  {
    id: "premium",
    image: premium,
    base: "banner-premium",
    alt: "প্রিমিয়াম কাটা আম — Premium sliced mango with vibrant orange flesh on dark linen and wood",
    eyebrow: "Premium Selection · প্রিমিয়াম",
    titleBn: "রাজকীয় স্বাদ, প্রতিটি কামড়ে",
    title: "Crafted by the Orchard",
    subtitle: "Single-estate fruit, graded by hand and packed in cushioned crates.",
    cta: "প্রিমিয়াম দেখুন",
    overlay: "from-[#08110A]/95 via-[#08110A]/70 to-[#08110A]/20",
  },
  {
    id: "seasonal",
    image: seasonal,
    base: "banner-seasonal-offer",
    alt: "বিভিন্ন জাতের আম — Flat-lay of multiple mango varieties on a bright orange burst background",
    eyebrow: "Seasonal Offer · মৌসুমি অফার",
    titleBn: "৳৩০০ ছাড়!",
    title: "Season Sale Is Live",
    subtitle: "Mix any three varieties and save on every crate this week only.",
    cta: "অফার লুফে নিন",
    badge: "৳৩০০ ছাড়!",
    overlay: "from-[#2A1200]/90 via-[#2A1200]/60 to-[#2A1200]/15",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden px-3 pt-24 md:pt-28">
      {/* Liquid glass ambient glow */}
      <div className="absolute left-1/4 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-mango/20 blur-[128px]" />
      <div className="absolute right-1/4 top-40 h-64 w-64 translate-x-1/2 rounded-full bg-mango/15 blur-[96px]" />
      
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]">
        {/* Liquid glass border effect - outer glass frame */}
        <div className="absolute inset-0 z-20 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 bg-gradient-to-br from-white/40 via-white/10 to-white/30 p-[1px] md:rounded-[3.5rem] backdrop-blur-[2px]">
          <div className="size-full rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-white/10 via-transparent to-white/20" />
        </div>
        
        {/* Liquid glass edge highlight */}
        <div className="absolute inset-[1px] z-30 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-[1px] z-30 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-tl from-white/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative h-[560px] w-full md:h-[620px]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <ResponsiveImage
                base={s.base}
                fallback={s.image}
                alt={s.alt}
                width={1920}
                height={1088}
                sizes="(max-width: 768px) 100vw, min(100vw, 1280px)"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                className="size-full object-cover object-right md:object-center"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
              {/* Liquid glass shimmer overlay - subtle light refraction */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-mango/5 to-transparent" />

              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-2xl px-7 md:px-14">
                  {/* Liquid glass eyebrow badge */}
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mango shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] backdrop-blur-xl">
                    <Leaf className="size-3.5" /> {s.eyebrow}
                  </span>

                  {s.badge && (
                    <span className="ml-2 inline-flex rounded-full bg-gradient-to-r from-mango to-mango/80 px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-[0_4px_16px_rgba(255,140,0,0.4)] backdrop-blur-sm">
                      {s.badge}
                    </span>
                  )}

                  <h1 className="mt-5 font-display text-[1.75rem] leading-[1.2] font-semibold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                    {s.titleBn}
                    <span className="mt-2 block text-mango drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">{s.title}</span>
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground md:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    {s.subtitle}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {/* Liquid glass CTA button */}
                    <a
                      href="#varieties"
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-mango px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_32px_rgba(255,140,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,140,0,0.5)] backdrop-blur-xl border border-mango/40"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {s.cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    {/* Liquid glass secondary button */}
                    <a
                      href="#banner-builder"
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-white/25 hover:border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl"
                    >
                      Try Banner Builder
                    </a>
                  </div>

                  {/* Liquid glass info badges */}
                  <div className="mt-9 flex flex-wrap gap-3 text-sm text-primary-foreground">
                    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md">
                      <Star className="size-4 fill-mango text-mango" /> 
                      <span className="font-medium">৪.৯ Rating · ২,৪০০+ অর্ডার</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md">
                      <Truck className="size-4 fill-mango text-mango" /> 
                      <span className="font-medium">১৫০০+ টাকায় ফ্রি ডেলিভারি</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Liquid glass navigation arrows */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-white/15 p-2.5 text-primary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl transition-all hover:bg-white/25 hover:border-white/60 md:left-6"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-white/15 p-2.5 text-primary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-xl transition-all hover:bg-white/25 hover:border-white/60 md:right-6"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Liquid glass pagination dots */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all backdrop-blur-sm ${
                  i === index ? "w-8 bg-gradient-to-r from-mango to-mango/70 shadow-[0_4px_12px_rgba(255,140,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]" : "w-2 bg-white/50 border border-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
