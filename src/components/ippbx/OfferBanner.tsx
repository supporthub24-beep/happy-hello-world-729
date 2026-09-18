import { BadgeCheck, Gift, Mic, PhoneCall } from "lucide-react";

const highlights = [
  {
    icon: Gift,
    title: "১ মাস চার্জ ফ্রি",
    description: "প্রথম মাসের সার্ভিস চার্জ সম্পূর্ণ ফ্রি",
  },
  {
    icon: PhoneCall,
    title: "IP নাম্বার ১০০% ফ্রি",
    description: "ইউনিক 096XXXXXX নাম্বার একদম ফ্রি",
  },
  {
    icon: Mic,
    title: "IVR রেকর্ড ১০০% ফ্রি",
    description: "প্রফেশনাল ভয়েস আর্টিস্ট রেকর্ডিং ফ্রি",
  },
];

export function OfferBanner() {
  return (
    <section
      id="pricing"
      aria-labelledby="ippbx-offer-heading"
      className="relative px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        >
          <div className="ippbx-glow-orb left-[-3rem] top-[-2rem] h-56 w-56 bg-ippbx-violet/45" />
          <div
            className="ippbx-glow-orb right-[-3rem] bottom-[-2rem] h-56 w-56 bg-ippbx-blue/45"
            style={{ animationDelay: "1.6s" }}
          />
        </div>

        <div className="ippbx-card relative overflow-hidden rounded-3xl border-2 border-ippbx-blue/40 px-5 py-12 shadow-2xl shadow-ippbx-navy/70 ring-1 ring-ippbx-border/60 sm:px-8 sm:py-14 lg:px-12">
          <div className="absolute right-4 top-4 flex flex-wrap items-center justify-end gap-2 sm:right-6 sm:top-6">
            <span className="rounded-full bg-ippbx-violet/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ippbx-violet ring-2 ring-ippbx-violet/60">
              প্রিমিয়াম
            </span>
            <span className="rounded-full bg-ippbx-blue/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-ippbx-blue ring-2 ring-ippbx-blue/60">
              বেস্ট ভ্যালু
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center text-center sm:mt-4">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ippbx-blue/70 bg-ippbx-blue/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ippbx-blue shadow-lg shadow-ippbx-blue/20">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Limited Time Offer
            </span>

            <h2
              id="ippbx-offer-heading"
              className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              <span className="ippbx-gradient-text">১ মাস সার্ভিস চার্জ ফ্রি</span>
            </h2>

            <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-foreground/80 sm:text-xl">
              ফ্রি IP নাম্বার • ফ্রি IVR ভয়েস রেকর্ডিং
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="ippbx-card group flex flex-col items-center rounded-2xl border-l-4 border-l-ippbx-blue px-5 py-7 text-center shadow-xl shadow-ippbx-navy/60 ring-1 ring-ippbx-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-l-ippbx-violet hover:shadow-2xl hover:shadow-ippbx-blue/30"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ippbx-blue to-ippbx-violet shadow-lg shadow-ippbx-blue/40">
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </span>
                  <p className="mt-5 font-display text-xl font-extrabold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
