import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import brandLogo from "@/assets/guardstone-logo.png.asset.json";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Varieties", to: "/", hash: "varieties" },
  { label: "About", to: "/", hash: "about" },
  { label: "Banner Builder", to: "/", hash: "banner-builder" },
];

const supportLinks = [
  { label: "Shipping & returns", to: "/", hash: "shipping" },
  { label: "Track order", to: "/", hash: "track-order" },
  { label: "Wholesale", to: "/", hash: "wholesale" },
  { label: "FAQ", to: "/", hash: "faq" },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <Link
            to="/"
            hash="top"
            aria-label="Hello World হোমপেজে ফিরে যান"
            className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            <img
              src={brandLogo.url}
              alt="GuardStone লোগো"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
            />
            <span className="font-display text-xl font-semibold">Hello World</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-secondary-foreground/70">
            Farm-direct mangoes from family orchards, picked ripe and shipped fast.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
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
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  {...(link.hash ? { hash: link.hash } : {})}
                  className="transition-colors hover:text-mango"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  hash={link.hash}
                  className="transition-colors hover:text-mango"
                >
                  {link.label}
                </Link>
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
