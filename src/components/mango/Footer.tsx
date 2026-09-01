import { Citrus, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-mango text-primary-foreground">
              <Citrus className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">Mango Fresh</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-secondary-foreground/70">
            Farm-direct mangoes from family orchards, picked ripe and shipped fast.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center rounded-full border border-secondary-foreground/20 transition-colors hover:bg-mango hover:text-primary-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
            {["Home", "Varieties", "About", "Banner Builder"].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                  className="transition-colors hover:text-mango"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
            {["Shipping & returns", "Track order", "Wholesale", "FAQ"].map((l) => (
              <li key={l}>
                <a href="#" className="transition-colors hover:text-mango">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-mango" /> Orchard Road, Chapainawabganj
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-mango" /> +880 1700 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-mango" /> hello@mangofresh.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/15 py-5 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} Mango Fresh. All rights reserved.
      </div>
    </footer>
  );
}
