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
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "bg-cream/90 shadow-[0_8px_30px_-18px_rgba(45,80,22,0.5)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" hash="home" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-mango text-secondary-foreground">
            <Citrus className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-secondary">
            Mango Fresh
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to="/"
                hash={l.hash}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-mango-deep"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="Open cart"
            className="relative rounded-full border border-border p-2 text-secondary transition-colors hover:bg-accent"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-mango text-[11px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/"
            hash="varieties"
            className="hidden rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 md:inline-block"
          >
            Order Now
          </Link>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-border p-2 text-secondary md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-cream md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to="/"
                  hash={l.hash}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-foreground/80"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm font-medium text-foreground/80"
              >
                Cart ({count})
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
