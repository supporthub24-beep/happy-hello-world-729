import { Link } from "@tanstack/react-router";

const footerLinks = [
  { label: "কল সেন্টার সার্ভিস", href: "https://itfair.bd/call-center" },
  { label: "SMS মার্কেটিং", href: "https://itfair.bd/sms-marketing" },
  { label: "ভয়েস মার্কেটিং", href: "https://itfair.bd/voice-marketing" },
  { label: "শর্তাবলী", href: "https://itfair.bd/terms" },
  { label: "প্রাইভেসি পলিসি", href: "https://itfair.bd/privacy" },
  { label: "রিফান্ড পলিসি", href: "https://itfair.bd/refund" },
  { label: "যোগাযোগ", href: "https://itfair.bd/contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ippbx-border/70 bg-ippbx-navy/60 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8">
        <Link
          to="/"
          hash="top"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          aria-label="Hello World হোমপেজে ফিরে যান"
        >
          <img
            src="/generated/06aa7253-10a-hello-world-logo.png"
            alt="Hello World লোগো"
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Hello World
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Authorized Reseller · Bangladesh
            </span>
          </span>
        </Link>

        <nav aria-label="ফুটার নেভিগেশন" className="w-full">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
          © 2026 Hello World — Lovable Pro Plan Authorized Reseller. সকল অধিকার সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
