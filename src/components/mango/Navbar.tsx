  import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Citrus, Menu, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/lib/cart";

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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" hash="home" className="flex items-center gap-2 group">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-mango/90 via-mango-bright/80 to-mango-deep/90 shadow-lg shadow-mango/20 text-white transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/30">
            <Citrus className="size-5 drop-shadow-sm" />
          </span>
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
            className="hidden rounded-full bg-gradient-to-r from-secondary/90 via-secondary/85 to-secondary/80 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-secondary/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/30 md:inline-block relative overflow-hidden group border border-white/30"
          >
            <span className="relative z-10 drop-shadow-sm">Order Now</span>
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
                className="block w-full rounded-full bg-gradient-to-r from-secondary/90 to-secondary/80 py-3 text-center text-sm font-bold text-white shadow-lg border border-white/30 backdrop-blur-sm"
              >
                Order Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}