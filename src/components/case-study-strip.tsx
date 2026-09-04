import { Link } from "@tanstack/react-router";

const caseStudies = [
  {
    eyebrow: "Residential project type",
    title: "Glass Balustrades & Open Staircases",
    description:
      "A clean, light-filled railing solution for staircases, balconies and contemporary homes.",
    scope: "Glass railings · Measurements · Installation",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
    alt: "Contemporary interior with glass railing details",
    href: "/services/glass-railings-balustrades",
    linkLabel: "Explore glass railings",
  },
  {
    eyebrow: "Commercial project type",
    title: "Aluminium Frontages & Glass Partitions",
    description:
      "A practical approach to brighter offices, shopfronts and customer-facing commercial spaces.",
    scope: "Aluminium systems · Glazing · Project coordination",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
    alt: "Modern commercial glass partition and office frontage",
    href: "/services/aluminium-works",
    linkLabel: "Explore aluminium works",
  },
  {
    eyebrow: "Custom fabrication",
    title: "Stainless-Steel Details Built to Fit",
    description:
      "Made-to-measure railings, gates and architectural metalwork shaped around the site and intended use.",
    scope: "Fabrication · Finishing · Supply and installation",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=85",
    alt: "Metalworker fabricating stainless steel in a workshop",
    href: "/services/stainless-steel-fabrication",
    linkLabel: "Explore stainless steel",
  },
];

export function CaseStudyStrip() {
  return (
    <section
      className="border-b border-border bg-white py-16 sm:py-20"
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
            className="inline-flex shrink-0 text-sm font-bold text-navy transition-colors hover:text-gold"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <article
              key={study.title}
              className="group overflow-hidden border border-border bg-white transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={study.image}
                  alt={study.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-0 top-0 bg-gold px-3 py-1.5 text-xs font-black text-navy-deep">
                  0{index + 1}
                </span>
              </div>
              <div className="p-6">
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
                  to={study.href as "/services/aluminium-works"}
                  className="mt-5 inline-flex text-sm font-bold text-navy transition-colors hover:text-gold"
                >
                  {study.linkLabel} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border border-gold/40 bg-gold/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm leading-relaxed text-navy">
            <strong>Have a similar project in mind?</strong> Send us your dimensions, drawings or
            reference images and we can help define the next step.
          </p>
          <Link
            to="/contact"
            className="inline-flex shrink-0 bg-navy px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-navy-deep"
          >
            Request a quote →
          </Link>
        </div>
      </div>
    </section>
  );
}
