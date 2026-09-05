import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { serviceLinks } from "@/lib/services";

const PHONE = "+254 717 614 427";
const PHONE_ALT = "+254 759 719 147";
const EMAIL = "eyetechengineering3@gmail.com";
const WHATSAPP = "https://wa.me/254717614427";


export function TopBar() {
  return (
    <div className="bg-gold text-navy-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-2 text-sm font-medium">
        <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="motion-link hover:underline">
          ☎ {PHONE}
        </a>
        <a
          href={`tel:${PHONE_ALT.replace(/\s/g, "")}`}
          className="motion-link hidden hover:underline sm:inline"
        >
          {PHONE_ALT}
        </a>
        <a href={`mailto:${EMAIL}`} className="motion-link hidden hover:underline md:inline">
          {EMAIL}
        </a>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="motion-link rounded-sm bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-deep"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/about-us", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="motion-link flex items-center gap-3"
          aria-label="Eyetech Engineering & Supplies home"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-navy text-sm font-black text-gold">
            E
          </span>
          <span className="text-sm font-medium text-navy sm:text-base">
            Eyetech Engineering &amp; Supplies
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-navy" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="motion-link text-xs font-bold uppercase tracking-widest transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="motion-link bg-navy px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-navy-deep"
          >
            Get a Quote
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="motion-link flex min-h-11 min-w-11 items-center justify-center text-navy md:hidden"
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="mt-1.5 block h-0.5 w-6 bg-current" />
            <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="motion-menu border-t border-border bg-white px-4 py-3 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="motion-link block min-h-11 border-b border-border py-3 text-xs font-bold uppercase tracking-widest text-navy"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="motion-link bg-navy px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-white"
            >
              Get a Quote
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="motion-link border border-navy px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-navy"
            >
              WhatsApp Us
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.2fr_0.9fr]">
        <div>
          <h3 className="text-base font-bold text-white">Eyetech Engineering &amp; Supplies</h3>
          <p className="mt-3 text-sm leading-relaxed">
            Steel, aluminium and glass fabrication and supplies for residential, commercial and
            public projects across Kenya.
          </p>
        </div>
        <div>
          <h4 className="eyebrow text-gold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="motion-link hover:text-gold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="motion-link hover:text-gold">
                All Services
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="motion-link hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="motion-link hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-gold">Services</h4>
          <ul className="mt-4 grid gap-2 text-sm">
            {serviceLinks.slice(0, 4).map((link) => (
              <li key={link.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: link.slug }}
                  className="motion-link hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-gold">Get In Touch</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>1st Floor B2, Elema Plaza, off North Airport Road, Pipeline, Embakasi, Nairobi</li>
            <li>
              <a href="tel:+254717614427" className="motion-link hover:text-gold">
                {PHONE}
              </a>
            </li>
            <li>
              <a href="tel:+254759719147" className="motion-link hover:text-gold">
                {PHONE_ALT}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="motion-link hover:text-gold">
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="motion-link hover:text-gold"
              >
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>

      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} Eyetech Engineering &amp; Supplies. All rights reserved.
      </div>
    </footer>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <span className="eyebrow text-gold">
        <span className="h-px w-8 bg-gold" />
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-3xl font-black leading-tight sm:text-4xl ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
