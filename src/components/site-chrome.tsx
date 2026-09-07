import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/components/cart-provider";
import { serviceLinks } from "@/lib/services";

const PHONE = "+254 717 614 427";
const PHONE_ALT = "+254 759 719 147";
const EMAIL = "eyetechengineering3@gmail.com";
const WHATSAPP = "https://wa.me/254717614427";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/eyetechengineering",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/eyetechengineering",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7 .1 5.7.2 4.9.4 4.1.7c-.8.3-1.4.7-2.1 1.4C1.4 2.7 1 3.3.7 4.1.4 4.9.2 5.7.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c.1 1.3.3 2.1.6 2.9.3.8.7 1.4 1.4 2.1.6.6 1.3 1 2.1 1.4.8.3 1.6.5 2.9.6 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.4-.7 2.1-1.4.6-.6 1-1.3 1.4-2.1.3-.8.5-1.6.6-2.9.1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.4-1.4-2.1C21.4 1.4 20.7 1 19.9.7c-.8-.3-1.6-.5-2.9-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.8-10.4a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@eyetechengineering",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M19.6 5.8a4.8 4.8 0 0 1-3.5-4.6V1h-3.4v13.6a2.9 2.9 0 1 1-2-2.7V8.4a6.3 6.3 0 1 0 5.4 6.2V8.3a8.1 8.1 0 0 0 4.7 1.5V6.4c-.3 0-.5 0-.8-.1a4.8 4.8 0 0 1-.4-.5z" />
      </svg>
    ),
  },
];

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
  const { itemCount } = useCart();
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/shop", label: "Shop" },
    { to: "/blog", label: "Blog" },
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-white p-1 shadow-sm ring-1 ring-border">
            <img
              src="/eyetech-logo.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
            />
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
            to="/shop/checkout"
            className="motion-link border border-navy px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Cart ({itemCount})
          </Link>
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
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Link
              to="/shop/checkout"
              onClick={() => setOpen(false)}
              className="motion-link border border-navy px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-navy"
            >
              Cart ({itemCount})
            </Link>
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
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-white p-1.5">
              <img
                src="/eyetech-logo.png"
                alt="Eyetech Engineering & Supplies logo"
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </span>
            <h3 className="text-base font-bold text-white">Eyetech Engineering &amp; Supplies</h3>
          </div>
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
              <Link to="/shop" className="motion-link hover:text-gold">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/blog" className="motion-link hover:text-gold">
                Blog
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
          <h4 className="eyebrow mt-6 text-gold">Follow Us</h4>
          <ul className="mt-3 flex items-center gap-3">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="motion-link flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition-colors hover:border-gold hover:text-gold"
                >
                  {social.icon}
                </a>
              </li>
            ))}
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
