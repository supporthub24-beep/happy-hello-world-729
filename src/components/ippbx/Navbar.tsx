import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";

const navLinks = [
  { label: "রিভিউ", href: "#about" },
  { label: "প্যাকেজ", href: "#pricing" },
  { label: "ফ্রি ট্রায়াল", href: "#trial" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "border-b-2 border-ippbx-blue/40 bg-ippbx-navy/90 shadow-xl shadow-ippbx-navy/60 backdrop-blur-xl"
          : "border-b-2 border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          aria-label="GuardStone হোমপেজ"
        >
          <img
            src="/generated/5731b571-50b-download.png"
            alt="GuardStone ব্র্যান্ড লোগো"
            width={40}
            height={40}
            decoding="async"
            className="h-9 w-9 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              GuardStone
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ippbx-blue">
              Authorized BD
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://itfair.bd/ippbx"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-ippbx-border px-4 py-2 text-sm font-bold text-foreground transition-all hover:border-ippbx-blue hover:bg-white/10 hover:shadow-lg hover:shadow-ippbx-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            My Dashboard
          </a>
          <a
            href="tel:09638461270"
            className="ippbx-gradient-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-ippbx-blue/40 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-ippbx-violet/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            09638461270
          </a>
          <a
            href="https://itfair.bd/support"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="সাপোর্ট"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ippbx-border px-3 py-1.5 text-sm font-bold text-foreground transition-all hover:border-ippbx-blue hover:bg-white/10 hover:shadow-lg hover:shadow-ippbx-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <img
              src="/generated/5731b571-50b-download.png"
              alt="সাপোর্ট"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 rounded-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span>Support</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="ippbx-mobile-menu"
          aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ippbx-border text-foreground transition-colors hover:border-ippbx-blue hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="ippbx-mobile-menu"
          className="border-t-2 border-ippbx-blue/40 bg-ippbx-navy/95 shadow-2xl shadow-ippbx-navy/60 backdrop-blur-xl md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-semibold text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2">
              <a
                href="https://itfair.bd/ippbx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-full border-2 border-ippbx-border px-4 py-3 text-center text-sm font-bold text-foreground transition-all hover:border-ippbx-blue hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                My Dashboard
              </a>
              <a
                href="tel:09638461270"
                onClick={() => setOpen(false)}
                className="ippbx-gradient-cta inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-lg shadow-ippbx-blue/40 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                09638461270
              </a>
              <a
                href="https://itfair.bd/support"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ippbx-border px-4 py-3 text-sm font-bold text-foreground transition-all hover:border-ippbx-blue hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                <img
                  src="/generated/5731b571-50b-download.png"
                  alt="সাপোর্ট"
                  width={28}
                  height={28}
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-7 rounded-full object-contain"
                />
                Support
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
