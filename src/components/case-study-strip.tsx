import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { siteImages } from "@/lib/site-images";

const categories = ["All", "Glass & Railings", "Aluminium", "Stainless Steel"] as const;
type Category = (typeof categories)[number];

type CaseStudy = {
  category: Exclude<Category, "All">;
  eyebrow: string;
  title: string;
  description: string;
  scope: string;
  image: string;
  alt: string;
  slug: "glass-railings-balustrades" | "aluminium-works" | "stainless-steel-fabrication";

  linkLabel: string;
};

const caseStudies: CaseStudy[] = [
  {
    category: "Glass & Railings",
    eyebrow: "Residential project type",
    title: "Glass Balustrades & Open Staircases",
    description:
      "A clean, light-filled railing solution for staircases, balconies and contemporary homes.",
    scope: "Glass railings · Measurements · Installation",
    image: siteImages.railing,
    alt: "Contemporary interior with glass railing details",
    slug: "glass-railings-balustrades",
    linkLabel: "Explore glass railings",
  },
  {
    category: "Aluminium",
    eyebrow: "Commercial project type",
    title: "Aluminium Frontages & Glass Partitions",
    description:
      "A practical approach to brighter offices, shopfronts and customer-facing commercial spaces.",
    scope: "Aluminium systems · Glazing · Project coordination",
    image: siteImages.glazing,
    alt: "Modern commercial glass partition and office frontage",
    slug: "aluminium-works",
    linkLabel: "Explore aluminium works",
  },
  {
    category: "Stainless Steel",
    eyebrow: "Custom fabrication",
    title: "Stainless-Steel Details Built to Fit",
    description:
      "Made-to-measure railings, gates and architectural metalwork shaped around the site and intended use.",
    scope: "Fabrication · Finishing · Supply and installation",
    image: siteImages.steel,
    alt: "Metalworker fabricating stainless steel in a workshop",
    slug: "stainless-steel-fabrication",
    linkLabel: "Explore stainless steel",
  },
];

export function CaseStudyStrip() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const visibleStudies =
    activeCategory === "All"
      ? caseStudies
      : caseStudies.filter((study) => study.category === activeCategory);

  return (
    <section
      className="motion-section border-b border-border bg-white py-16 sm:py-20"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" />
              Project proof
            </span>
            <h2
              id="proof-heading"
              className="mt-4 text-3xl font-black leading-tight text-navy sm:text-4xl"
            >
              See how the right details change a space
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Explore representative project types and the services behind them. Replace these
              profiles with verified project photography, locations and client-approved results as
              the portfolio grows.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-navy transition-colors hover:text-gold"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-8" aria-label="Filter project proof by service type">
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            role="group"
          >
            {categories.map((category) => {
              const selected = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${selected ? "border-navy bg-navy text-white" : "border-border bg-white text-navy hover:border-navy"}`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          <p
            className="mt-3 text-xs font-medium text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            Showing {visibleStudies.length}{" "}
            {visibleStudies.length === 1 ? "project type" : "project types"}
            {activeCategory === "All" ? "" : ` for ${activeCategory}`}
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visibleStudies.map((study, index) => (
            <article
              key={study.title}
              className="motion-card group overflow-hidden border border-border bg-white transition-shadow duration-300 hover:shadow-xl active:scale-[0.99] motion-reduce:transition-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={study.image}
                  alt={study.alt}
                  loading="lazy"
                  className="motion-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                <span className="absolute left-0 top-0 bg-gold px-3 py-1.5 text-xs font-black text-navy-deep">
                  0{index + 1}
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {study.eyebrow}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-tight text-navy">{study.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {study.description}
                </p>
                <p className="mt-5 border-t border-border pt-4 text-xs font-bold uppercase tracking-wider text-navy">
                  {study.scope}
                </p>
                <Link
                  to="/services/$slug"
                  params={{ slug: study.slug }}
                  className="motion-link mt-5 inline-flex min-h-11 items-center text-sm font-bold text-navy transition-colors hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                >
                  {study.linkLabel} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="motion-card mt-8 flex flex-col gap-4 border border-gold/40 bg-gold/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm leading-relaxed text-navy">
            <strong>Have a similar project in mind?</strong> Send us your dimensions, drawings or
            reference images and we can help define the next step.
          </p>
          <Link
            to="/contact"
            className="motion-link inline-flex min-h-11 shrink-0 items-center justify-center bg-navy px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-navy-deep focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          >
            Request a quote →
          </Link>
        </div>
      </div>
    </section>
  );
}
