import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flame, Menu, ShoppingCart, Timer, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import brandLogo from "@/assets/guardstone-logo.png.asset.json";

const links = [
  { label: "Home", hash: "home" },
  { label: "Varieties", hash: "varieties" },
  { label: "About", hash: "about" },
  { label: "Banner Builder", hash: "banner-builder" },
  { label: "Contact", hash: "contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/20 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.3)] backdrop-blur-[20px] border-b border-white/30"
          : "bg-gradient-to-b from-white/25 via-white/15 to-transparent backdrop-blur-[16px]"
      }`}
    >
      {/* Urgency strip */}
      <div className="bg-gradient-to-r from-mango-deep via-mango to-mango-deep px-4 py-1.5 text-center text-[11px] font-bold uppercase tracking-widest text-primary-foreground shadow-[0_4px_16px_rgba(255,140,0,0.4)] sm:text-xs">
        <span className="inline-flex items-center gap-2">
          <Flame className="size-3.5 animate-pulse" aria-hidden="true" />
          সীমিত স্টক · আজই শেষ হতে পারে
          <span className="hidden sm:inline">·</span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Timer className="size-3.5" aria-hidden="true" />
            ২৪ ঘণ্টায় ডেলিভারি ডিসপ্যাচ
          </span>
        </span>
      </div>

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" hash="home" className="flex items-center gap-2 group">
          <img
            src={brandLogo.url}
            alt="GuardStone লোগো"
            width={36}
            height={36}
            decoding="async"
            className="size-9 rounded-full object-contain shadow-lg shadow-mango/20 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-foreground drop-shadow-sm">
            Mango Fresh
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to="/"
                hash={l.hash}
                className="relative text-sm font-semibold text-foreground transition-all duration-300 hover:text-mango-deep group drop-shadow-sm"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-mango to-mango-deep transition-all duration-300 group-hover:w-full rounded-full shadow-sm shadow-mango/30" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label="Open cart"
            className="relative rounded-full border border-white/40 bg-white/20 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/35 hover:shadow-xl hover:shadow-mango/20 hover:border-white/50"
          >
            <ShoppingCart className="size-5 drop-shadow-sm" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-mango/90 to-mango-deep/90 text-[11px] font-bold text-white shadow-lg shadow-mango/30 backdrop-blur-sm border border-white/30">
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/"
            hash="varieties"
            className="hidden rounded-full bg-gradient-to-r from-mango to-mango-deep px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_8px_32px_rgba(255,140,0,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(255,140,0,0.65)] md:inline-flex md:items-center md:gap-2 relative overflow-hidden group border border-mango/40"
          >
            <span className="relative z-10 inline-flex items-center gap-2 drop-shadow-sm">
              <Flame className="size-4 transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
              Order Now
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/40 bg-white/20 p-2.5 text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/35 md:hidden hover:border-white/50"
          >
            {open ? <X className="size-5 drop-shadow-sm" /> : <Menu className="size-5 drop-shadow-sm" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/30 bg-white/15 backdrop-blur-[24px] md:hidden shadow-2xl shadow-black/20">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to="/"
                  hash={l.hash}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-bold text-foreground transition-all duration-200 hover:text-mango-deep hover:pl-2 hover:bg-white/10 rounded-lg px-2 drop-shadow-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-bold text-foreground transition-all duration-200 hover:text-mango-deep hover:pl-2 hover:bg-white/10 rounded-lg px-2 drop-shadow-sm"
              >
                Cart ({count})
              </Link>
            </li>
            <li className="pt-3 mt-2 border-t border-white/20">
              <Link
                to="/"
                hash="varieties"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mango to-mango-deep py-3 text-center text-sm font-bold text-primary-foreground shadow-[0_8px_32px_rgba(255,140,0,0.5)] border border-mango/40 backdrop-blur-sm"
              >
                <Flame className="size-4" aria-hidden="true" />
                Order Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
