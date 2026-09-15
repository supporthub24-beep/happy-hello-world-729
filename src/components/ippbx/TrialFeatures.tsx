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
          <h2
            id="ippbx-trial-heading"
            className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            🎁 ৩ দিন ফ্রি ট্রায়াল
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            এই সকল সুবিধা ৩ দিন ফ্রি ট্রায়াল দিয়ে যাচাই করুন — ভালো লাগলে তারপর পেমেন্ট করুন। কোনো
            হিডেন চার্জ নেই।
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="ippbx-card flex items-start gap-3 rounded-2xl px-4 py-4 shadow-lg shadow-ippbx-navy/40 sm:px-5"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-ippbx-green"
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-foreground sm:text-base">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href="https://itfair.bd/ippbx"
            target="_blank"
            rel="noopener noreferrer"
            className="ippbx-gradient-cta inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-ippbx-blue/30 transition-all hover:brightness-110 hover:shadow-ippbx-violet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            ড্যাশবোর্ড অ্যাক্সেস করুন
          </a>
          <a
            href="tel:09638461270"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ippbx-blue/70 bg-ippbx-blue/10 px-7 py-3.5 text-base font-semibold text-ippbx-blue transition-all hover:bg-ippbx-blue/20 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            আরও বিস্তারিত জানুন
          </a>
        </div>
      </div>
    </section>
  );
}
