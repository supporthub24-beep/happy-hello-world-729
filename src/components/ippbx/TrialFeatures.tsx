import { CheckCircle2, FileText, PhoneCall } from "lucide-react";

const features = [
  "৩ দিন ফ্রি ট্রায়াল — যাচাই করে তারপর পেমেন্ট",
  "১ মাসের সার্ভিস চার্জ ফ্রি",
  "সম্পূর্ণ IPPBX ইন্সটলেশন",
  "IVR / Auto Attendant কনফিগ",
  "৫ টি এক্সটেনশন",
  "ফ্রি ইউনিক IP নাম্বার (096XXXXXX)",
  "ফ্রি প্রফেশনাল ভয়েস আর্টিস্ট রেকর্ডিং",
  "মোবাইল ও ডেস্কটপ অ্যাপ",
  "ভয়েস মার্কেটিং (ড্যাশবোর্ড থেকে বাল্ক ভয়েস SMS)",
  "SMS মার্কেটিং (বাংলা ও ইংরেজি বাল্ক SMS)",
  "অটো কল রিমাইন্ডার (নির্দিষ্ট তারিখ ও সময়ে স্বয়ংক্রিয় কল)",
  "অটো SMS (কল রিসিভ হলেই টেমপ্লেট SMS)",
  "ফ্রি ডেভেলপার API (SMS ও ভয়েস)",
  "ফ্রি WooCommerce প্লাগিন (অর্ডার কনফার্মেশন কল ও SMS)",
  "কল রেকর্ডিং ও রিপোর্ট",
  "টিম ট্রেনিং সেশন",
  "১০% রিচার্জ বোনাস",
  "লাইফটাইম ফ্রি সাপোর্ট",
];

export function TrialFeatures() {
  return (
    <section
      id="trial"
      aria-labelledby="ippbx-trial-heading"
      className="relative px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ippbx-green/70 bg-ippbx-green/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ippbx-green shadow-lg shadow-ippbx-green/20 sm:text-sm">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            No Hidden Charge
          </span>
          <h2
            id="ippbx-trial-heading"
            className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            🎁 ৩ দিন ফ্রি ট্রায়াল
          </h2>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-foreground/80 sm:text-xl">
            এই সকল সুবিধা ৩ দিন ফ্রি ট্রায়াল দিয়ে যাচাই করুন — ভালো লাগলে তারপর পেমেন্ট করুন। কোনো
            হিডেন চার্জ নেই।
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="ippbx-card group flex items-start gap-3.5 rounded-2xl border-l-4 border-l-ippbx-green px-5 py-5 shadow-xl shadow-ippbx-navy/60 ring-1 ring-ippbx-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-l-ippbx-blue hover:shadow-2xl hover:shadow-ippbx-blue/30 sm:px-6"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ippbx-green/15 ring-1 ring-ippbx-green/40 transition-colors duration-300 group-hover:bg-ippbx-blue/15 group-hover:ring-ippbx-blue/40">
                <CheckCircle2
                  className="h-4.5 w-4.5 text-ippbx-green transition-colors duration-300 group-hover:text-ippbx-blue"
                  aria-hidden="true"
                />
              </span>
              <span className="text-base font-semibold leading-relaxed text-foreground sm:text-lg">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="https://itfair.bd/ippbx"
            target="_blank"
            rel="noopener noreferrer"
            className="ippbx-gradient-cta inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white shadow-xl shadow-ippbx-blue/40 ring-2 ring-ippbx-blue/40 transition-all hover:scale-[1.03] hover:brightness-110 hover:shadow-2xl hover:shadow-ippbx-violet/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            ড্যাশবোর্ড অ্যাক্সেস করুন
          </a>
          <a
            href="tel:09638461270"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ippbx-blue/80 bg-ippbx-blue/15 px-8 py-4 text-lg font-bold text-ippbx-blue shadow-lg shadow-ippbx-blue/20 transition-all hover:scale-[1.03] hover:bg-ippbx-blue/25 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            আরও বিস্তারিত জানুন
          </a>
        </div>
      </div>
    </section>
  );
}
