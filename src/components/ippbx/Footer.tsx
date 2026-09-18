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
    <footer className="relative border-t-2 border-ippbx-blue/40 bg-ippbx-navy/80 px-4 py-14 shadow-2xl shadow-ippbx-navy/60 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-9">
        <Link
          to="/"
          hash="top"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          aria-label="GuardStone হোমপেজে ফিরে যান"
        >
          <img
            src="/generated/5731b571-50b-download.png"
            alt="GuardStone লোগো"
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              GuardStone
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ippbx-blue">
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
                  className="rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-center text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
          © 2026 GuardStone — Lovable Pro Plan Authorized Reseller. সকল অধিকার সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
