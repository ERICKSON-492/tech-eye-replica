import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

type HeroSlide = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  alt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const slides: HeroSlide[] = [
  {
    eyebrow: "Eyetech Engineering & Supplies",
    title: "Designed with Precision.",
    accent: "Fabricated with Strength",
    description:
      "Steel, aluminium and glass fabrication and supplies for residential, commercial and public projects across Kenya.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=85",
    alt: "Glass and steel high-rise buildings",
    primaryLabel: "Explore Services →",
    primaryHref: "#ey-services",
    secondaryLabel: "View Our Work",
    secondaryHref: "#ey-projects",
  },
  {
    eyebrow: "Custom Fabrication",
    title: "Built for the Way",
    accent: "Your Space Works",
    description:
      "From stainless-steel railings to architectural details, we turn measurements and ideas into durable finished work.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=85",
    alt: "Metalworker fabricating steel in a workshop",
    primaryLabel: "Explore Fabrication →",
    primaryHref: "/services/stainless-steel-fabrication",
    secondaryLabel: "Request a Quote",
    secondaryHref: "/contact",
  },
  {
    eyebrow: "Glass & Aluminium",
    title: "Modern Details.",
    accent: "Practical Solutions",
    description:
      "Create brighter, cleaner spaces with aluminium systems, glass partitions, balustrades and custom installations.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1920&q=85",
    alt: "Bright contemporary interior with glass and aluminium details",
    primaryLabel: "Discover Glass & Aluminium →",
    primaryHref: "/services/aluminium-works",
    secondaryLabel: "Talk to Us",
    secondaryHref: "/contact",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="Eyetech featured services"
      aria-roledescription="carousel"
      className="relative isolate min-h-[560px] overflow-hidden bg-navy-deep sm:min-h-[620px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}: ${slide.title} ${slide.accent}`}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${index === activeIndex ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          >
            <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/25" />
          </div>
        ))}
      </div>

      <div className="relative z-20 mx-auto flex min-h-[560px] max-w-6xl flex-col justify-center px-4 py-24 sm:min-h-[620px] sm:py-32">
        {slides.map((slide, index) => (
          <div key={slide.title} className={`${index === activeIndex ? "block" : "hidden"}`}>
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" />
              {slide.eyebrow}
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] text-white sm:text-6xl">
              {slide.title} <span className="block text-gold">{slide.accent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              {slide.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              {slide.primaryHref.startsWith("/") ? (
                <Link
                  to={slide.primaryHref as "/contact"}
                  className="bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy-deep"
                >
                  {slide.primaryLabel}
                </Link>
              ) : (
                <a
                  href={slide.primaryHref}
                  className="bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy-deep"
                >
                  {slide.primaryLabel}
                </a>
              )}
              {slide.secondaryHref.startsWith("/") ? (
                <Link
                  to={slide.secondaryHref as "/contact"}
                  className="border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {slide.secondaryLabel}
                </Link>
              ) : (
                <a
                  href={slide.secondaryHref}
                  className="border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {slide.secondaryLabel}
                </a>
              )}
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-4 right-4 flex items-center justify-between sm:bottom-10">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose hero slide">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                onClick={() => showSlide(index)}
                className={`h-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy-deep ${index === activeIndex ? "w-12 bg-gold" : "w-6 bg-white/40 hover:bg-white/80"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous hero slide"
              onClick={() => showSlide(activeIndex - 1)}
              className="flex h-10 w-10 items-center justify-center border border-white/40 text-lg text-white transition-colors hover:bg-white hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next hero slide"
              onClick={() => showSlide(activeIndex + 1)}
              className="flex h-10 w-10 items-center justify-center border border-white/40 text-lg text-white transition-colors hover:bg-white hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
