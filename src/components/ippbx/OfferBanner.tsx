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
      className="relative px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
        >
          <div className="ippbx-glow-orb left-[-3rem] top-[-2rem] h-56 w-56 bg-ippbx-violet/35" />
          <div
            className="ippbx-glow-orb right-[-3rem] bottom-[-2rem] h-56 w-56 bg-ippbx-blue/35"
            style={{ animationDelay: "1.6s" }}
          />
        </div>

        <div className="ippbx-card relative overflow-hidden rounded-3xl px-5 py-10 shadow-2xl shadow-ippbx-navy/50 sm:px-8 sm:py-12 lg:px-12">
          <div className="absolute right-4 top-4 flex flex-wrap items-center justify-end gap-2 sm:right-6 sm:top-6">
            <span className="rounded-full bg-ippbx-violet/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ippbx-violet ring-1 ring-ippbx-violet/50">
              প্রিমিয়াম
            </span>
            <span className="rounded-full bg-ippbx-blue/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ippbx-blue ring-1 ring-ippbx-blue/50">
              বেস্ট ভ্যালু
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center text-center sm:mt-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-ippbx-blue/50 bg-ippbx-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ippbx-blue">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Limited Time Offer
            </span>

            <h2
              id="ippbx-offer-heading"
              className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              <span className="ippbx-gradient-text">১ মাস সার্ভিস চার্জ ফ্রি</span>
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              ফ্রি IP নাম্বার • ফ্রি IVR ভয়েস রেকর্ডিং
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="ippbx-card flex flex-col items-center rounded-2xl px-5 py-6 text-center shadow-lg shadow-ippbx-navy/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ippbx-blue to-ippbx-violet shadow-lg shadow-ippbx-blue/30">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-display text-lg font-bold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
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
