import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Star, Truck } from "lucide-react";
import freshHarvest from "@/assets/banner-fresh-harvest.jpg";
import premium from "@/assets/banner-premium.jpg";
import seasonal from "@/assets/banner-seasonal-offer.jpg";

type Slide = {
  id: string;
  image: string;
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
    alt: "তাজা রসালো আম ও পাতা — Fresh juicy ripe mangoes with water droplets and green leaves",
    eyebrow: "Fresh Harvest · তাজা ফলন",
    titleBn: "আমের রাজ্যে স্বাগতম",
    title: "Nature's Sweetest Gift",
    subtitle: "Hand-picked at sunrise, shipped within 24 hours — no carbide, no cold storage.",
    cta: "এখনই অর্ডার করুন",
    overlay: "from-[#2D2003]/70 via-[#2D2003]/35 to-transparent",
  },
  {
    id: "premium",
    image: premium,
    alt: "প্রিমিয়াম কাটা আম — Premium sliced mango with vibrant orange flesh on dark linen and wood",
    eyebrow: "Premium Selection · প্রিমিয়াম",
    titleBn: "রাজকীয় স্বাদ, প্রতিটি কামড়ে",
    title: "Crafted by the Orchard",
    subtitle: "Single-estate fruit, graded by hand and packed in cushioned crates.",
    cta: "প্রিমিয়াম দেখুন",
    overlay: "from-[#0F1A0A]/85 via-[#0F1A0A]/45 to-transparent",
  },
  {
    id: "seasonal",
    image: seasonal,
    alt: "বিভিন্ন জাতের আম — Flat-lay of multiple mango varieties on a bright orange burst background",
    eyebrow: "Seasonal Offer · মৌসুমি অফার",
    titleBn: "৳৩০০ ছাড়!",
    title: "Season Sale Is Live",
    subtitle: "Mix any three varieties and save on every crate this week only.",
    cta: "অফার লুফে নিন",
    badge: "৳৩০০ ছাড়!",
    overlay: "from-[#3A1C00]/70 via-[#3A1C00]/30 to-transparent",
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
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem]">
        <div className="relative h-[560px] w-full md:h-[620px]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={s.image}
                alt={s.alt}
                width={1920}
                height={800}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                className="size-full object-cover object-right md:object-center"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />

              <div className="absolute inset-0 flex items-center">
                <div className="w-full max-w-2xl px-7 md:px-14">
                  <span className="inline-flex items-center gap-2 rounded-full border border-mango/50 bg-black/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-mango backdrop-blur-sm">
                    <Leaf className="size-3.5" /> {s.eyebrow}
                  </span>

                  {s.badge && (
                    <span className="ml-2 inline-flex rounded-full bg-mango px-4 py-1.5 text-xs font-bold text-primary-foreground">
                      {s.badge}
                    </span>
                  )}

                  <h1 className="mt-5 font-display text-3xl leading-[1.15] font-semibold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
                    {s.titleBn}
                    <span className="mt-2 block text-mango">{s.title}</span>
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/85 md:text-base">
                    {s.subtitle}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#varieties"
                      className="group inline-flex items-center gap-2 rounded-full bg-mango px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-12px_rgba(255,140,0,0.85)] transition-transform hover:-translate-y-0.5"
                    >
                      {s.cta}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                      href="#banner-builder"
                      className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-secondary"
                    >
                      Try Banner Builder
                    </a>
                  </div>

                  <div className="mt-9 flex flex-wrap gap-6 text-sm text-primary-foreground/85">
                    <div className="flex items-center gap-2">
                      <Star className="size-4 fill-mango text-mango" /> 4.9 / 5 · 2,400+ orders
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="size-4 text-mango" /> Free delivery over ৳1500
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => go(-1)}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-black/50 md:left-6"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-black/50 md:right-6"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-mango" : "w-2 bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
