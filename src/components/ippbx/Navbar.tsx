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
          ? "border-b border-ippbx-border/70 bg-ippbx-navy/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          aria-label="ITFair হোমপেজ"
        >
          <img
            src="/generated/3d7e44ea-d49-hello-world-support-logo.png"
            alt="ITFair লোগো"
            width={40}
            height={40}
            decoding="async"
            className="h-10 w-10 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              ITFair
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Authorized BD
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
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
            className="rounded-full border border-ippbx-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-ippbx-blue hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
          >
            My Dashboard
          </a>
          <a
            href="tel:09638461270"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ippbx-blue to-ippbx-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-ippbx-blue/25 transition-all hover:brightness-110 hover:shadow-ippbx-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ippbx-navy"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            09638461270
          </a>
          <a
            href="https://itfair.bd/support"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="সাপোর্ট"
            className="group inline-flex items-center gap-2 rounded-full border border-ippbx-border px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-ippbx-blue hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
          >
            <img
              src="/generated/3d7e44ea-d49-hello-world-support-logo.png"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ippbx-border text-foreground transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue md:hidden"
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
          className="border-t border-ippbx-border/70 bg-ippbx-navy/95 backdrop-blur-xl md:hidden"
        >
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
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
                className="rounded-full border border-ippbx-border px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:border-ippbx-blue hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                My Dashboard
              </a>
              <a
                href="tel:09638461270"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ippbx-blue to-ippbx-violet px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ippbx-blue/25 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                09638461270
              </a>
              <a
                href="https://itfair.bd/support"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ippbx-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-ippbx-blue hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ippbx-blue"
              >
                <img
                  src="/generated/3d7e44ea-d49-hello-world-support-logo.png"
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
