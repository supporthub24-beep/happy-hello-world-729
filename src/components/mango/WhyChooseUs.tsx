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
    <section id="about" className="bg-secondary py-20 text-secondary-foreground md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Why families across the country order from us
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div className="h-full rounded-3xl border border-secondary-foreground/15 bg-secondary-foreground/5 p-7 transition-colors hover:bg-secondary-foreground/10">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-mango text-primary-foreground">
                  <f.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/75">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}