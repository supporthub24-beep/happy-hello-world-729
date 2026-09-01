import { useEffect, useState } from "react";
import { Citrus, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Varieties", href: "#varieties" },
  { label: "About", href: "#about" },
  { label: "Banner Builder", href: "#banner-builder" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <a href="#home" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-mango text-secondary-foreground">
            <Citrus className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-secondary">
            Mango Fresh
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-mango-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#varieties"
          className="hidden rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 md:inline-block"
        >
          Order Now
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-border p-2 text-secondary md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-cream md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-foreground/80"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
