import { Link } from "@tanstack/react-router";
import { useState } from "react";

const PHONE = "+254 717 614 427";
const WHATSAPP = "https://wa.me/254717614427";

export function TopBar() {
  return (
    <div className="bg-gold text-navy-deep">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-2 text-sm font-medium">
        <span>☎ {PHONE}</span>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm bg-navy px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-navy-deep"
        >
          Whatsapp
        </a>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/about-us", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-navy text-sm font-black text-gold">
            E
          </span>
          <span className="text-sm font-medium text-navy sm:text-base">
            Eyetech Engineering &amp; Supplies
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-navy" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-navy md:hidden"
        >
          <span className="block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
          <span className="mt-1.5 block h-0.5 w-6 bg-current" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-widest text-navy"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Eyetech Engineering &amp; Supplies
          </h3>
          <p className="mt-3 text-sm leading-relaxed">
            Steel, aluminium and glass fabrication and supplies for residential,
            commercial and public projects across Kenya.
          </p>
        </div>
        <div>
          <h4 className="eyebrow text-gold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="eyebrow text-gold">Get In Touch</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Nairobi, Kenya</li>
            <li>
              <a href="tel:+254717614427" className="hover:text-gold">
                {PHONE}
              </a>
            </li>
            <li>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-gold">
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
  title: React.ReactNode;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <span className={`eyebrow ${light ? "text-gold" : "text-gold"}`}>
        <span className="h-px w-8 bg-gold" />
        {eyebrow}
      </span>
      <h2
        className={`mt-4 text-3xl font-black leading-tight sm:text-4xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
