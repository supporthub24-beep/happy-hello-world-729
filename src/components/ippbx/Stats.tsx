import { BadgeCheck, Headphones, PhoneCall, Wallet } from "lucide-react";

const stats = [
  {
    value: "০৳",
    label: "শুরুর খরচ",
    icon: Wallet,
  },
  {
    value: "৩ দিন",
    label: "ফ্রি ট্রায়াল",
    icon: BadgeCheck,
  },
  {
    value: "৫০০+",
    label: "একটিভ বিজনেস",
    icon: PhoneCall,
  },
  {
    value: "২৪/৭",
    label: "বাংলা সাপোর্ট",
    icon: Headphones,
  },
];

export function Stats() {
  return (
    <section
      aria-label="ITFair IPPBX পরিসংখ্যান"
      className="relative px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="ippbx-card group relative overflow-hidden rounded-2xl border-l-4 border-l-ippbx-blue px-5 py-6 text-center shadow-xl shadow-ippbx-navy/60 ring-1 ring-ippbx-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-l-ippbx-violet hover:shadow-2xl hover:shadow-ippbx-blue/30 sm:px-6 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ippbx-blue/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ippbx-blue to-ippbx-violet shadow-lg shadow-ippbx-blue/30">
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:text-base">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
