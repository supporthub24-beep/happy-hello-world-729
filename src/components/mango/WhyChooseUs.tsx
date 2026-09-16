import { Flame, Leaf, ShieldCheck, Timer, Truck, Wallet } from "lucide-react";
import { Reveal } from "./Reveal";
import mangoTree from "@/assets/banner-orchard.jpg";

const features = [
  {
    icon: Leaf,
    title: "Freshness guaranteed — or it's free",
    text: "Naturally ripened, never carbide-treated. If a single mango isn't perfect, we replace the whole crate. No arguments, no forms.",
  },
  {
    icon: Timer,
    title: "Harvested today, at your door tomorrow",
    text: "Cold-chain dispatch within 24 hours of picking and nationwide delivery in 2 days or less — or your delivery fee comes straight back.",
  },
  {
    icon: Wallet,
    title: "Farm-direct pricing, up to 30% less",
    text: "No middlemen, no showroom markup. Growers earn more and you pay up to 30% below retail — the same crate, a fraction of the price.",
  },
];

const promises = [
  { icon: ShieldCheck, label: "১০০% মানি-ব্যাক গ্যারান্টি" },
  { icon: Truck, label: "২৪ ঘণ্টায় ডেলিভারি ডিসপ্যাচ" },
  { icon: Flame, label: "সীমিত স্টক · আজই শেষ হতে পারে" },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="relative overflow-hidden bg-background py-20 text-foreground md:py-28">
      {/* Background liquid glass effect - subtle and behind content */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-mango/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-mango/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mango-deep">
                From our orchard
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Why families across the country refuse to buy mangoes anywhere else
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                Every crate starts on a family orchard in Chapainawabganj, where the fruit is left
                to ripen on the tree and picked by hand at first light. Nothing is rushed, nothing
                is forced — just real mangoes, packed the same day they leave the branch. Once you
                taste the difference, supermarket mangoes stop being an option.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {promises.map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-2 rounded-full border border-mango/40 bg-mango/10 px-4 py-2 text-xs font-semibold text-mango-deep shadow-sm backdrop-blur-sm"
                  >
                    <p.icon className="size-4" aria-hidden="true" />
                    {p.label}
                  </span>
                ))}
              </div>

              <a
                href="#varieties"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mango to-mango-deep px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_8px_32px_rgba(255,140,0,0.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,140,0,0.6)]"
              >
                Grab your crate before it's gone
                <Flame className="size-4 transition-transform group-hover:scale-110" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-xl">
              <img
                src={mangoTree}
                alt="সবুজ পাতার ফাঁকে গাছে ঝুলে থাকা পাকা আম — Ripe mangoes hanging on a leafy orchard tree in natural sunlight"
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-mango to-mango/80 px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-[0_4px_16px_rgba(255,140,0,0.5)] backdrop-blur-sm">
                <Flame className="size-3.5" aria-hidden="true" />
                সীমিত স্টক · আজই অর্ডার করুন
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="group h-full overflow-hidden rounded-3xl border border-border/50 bg-card p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-mango/50 hover:shadow-2xl hover:shadow-mango/20">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-mango text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
