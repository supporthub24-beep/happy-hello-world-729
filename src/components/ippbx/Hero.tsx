import { ArrowRight, MessageCircle, PhoneCall, Rocket, Sparkles } from "lucide-react";

const headlineLines = [
  { text: "আপনার ব্যবসাকে", delay: "0ms" },
  { text: "প্রফেশনাল করার", delay: "140ms" },
  { text: "এখনই সময়", delay: "280ms" },
];

const whatsappMessage = encodeURIComponent(
  "আসসালামু আলাইকুম, ITFair IPPBX সম্পর্কে জানতে চাই। ৩ দিনের ফ্রি ট্রায়াল নিতে চাই।",
);

export function Hero() {
  return (
    <section
      id="about"
      aria-labelledby="ippbx-hero-heading"
      className="relative isolate overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="ippbx-grid-lines absolute inset-0 opacity-60" />
        <div
          className="ippbx-glow-orb left-1/2 top-[-6rem] h-72 w-72 -translate-x-1/2 bg-ippbx-blue/40 sm:h-96 sm:w-96"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="ippbx-glow-orb left-[-4rem] top-40 h-64 w-64 bg-ippbx-violet/35 sm:h-80 sm:w-80"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="ippbx-glow-orb right-[-3rem] top-24 h-56 w-56 bg-ippbx-blue/25 sm:h-72 sm:w-72"
          style={{ animationDelay: "2.4s" }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-ippbx-blue/60 bg-ippbx-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ippbx-blue sm:text-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Call Center IPPBX Solution
        </span>

        <h1
          id="ippbx-hero-heading"
          className="mt-7 font-display text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {headlineLines.map((line) => (
            <span
              key={line.text}
              className="block animate-rise"
              style={{ animationDelay: line.delay }}
            >
              {line.text}
            </span>
          ))}
        </h1>

        <p
          className="mt-6 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "420ms" }}
        >
          WooCommerce প্লাগিন, ভয়েস মার্কেটিং, SMS মার্কেটিং, অর্ডার ভেরিফাই, রি-টার্গেটিং, IVR ও কল
          রেকর্ডিং — সব সুবিধা এক প্ল্যাটফর্মেই
        </p>

        <div
          className="mt-9 flex w-full animate-rise flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
          style={{ animationDelay: "540ms" }}
        >
          <a
            href="https://itfair.bd/ippbx"
            target="_blank"
            rel="noopener noreferrer"
            className="ippbx-gradient-cta inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-ippbx-blue/30 transition-all hover:brightness-110 hover:shadow-ippbx-violet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <Rocket className="h-5 w-5" aria-hidden="true" />
            ০৳ এ শুরু করুন
          </a>
          <a
            href={`https://wa.me/8801787261019?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ippbx-green/70 bg-ippbx-green/10 px-7 py-3.5 text-base font-semibold text-ippbx-green transition-all hover:bg-ippbx-green/20 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-green focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <a
          href="#trial"
          className="mt-6 inline-flex animate-rise items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
          style={{ animationDelay: "660ms" }}
        >
          <PhoneCall className="h-4 w-4 text-ippbx-blue" aria-hidden="true" />
          ফ্রি কলব্যাক নিন — আমরাই কল করব
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
