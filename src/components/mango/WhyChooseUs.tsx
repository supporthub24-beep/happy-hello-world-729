 import { Leaf, Timer, Wallet } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  {
    icon: Leaf,
    title: "Freshness guaranteed",
    text: "Naturally ripened, never carbide-treated. If it isn't perfect, we replace the crate.",
  },
  {
    icon: Timer,
    title: "Fast delivery",
    text: "Cold-chain dispatch within 24 hours of harvest, nationwide in 2 days or less.",
  },
  {
    icon: Wallet,
    title: "Farm direct pricing",
    text: "No middlemen. Growers earn more, you pay up to 30% less than retail.",
  },
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
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Why families across the country order from us
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="group h-full overflow-hidden rounded-3xl border border-border/50 bg-card p-7 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-mango/10">
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