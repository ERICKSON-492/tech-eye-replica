import { Link, createFileRoute } from "@tanstack/react-router";
import { CaseStudyStrip } from "@/components/case-study-strip";
import { HeroCarousel } from "@/components/hero-carousel";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { services as serviceCatalog } from "@/lib/services";
import { siteImages } from "@/lib/site-images";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Eyetech Engineering & Supplies | Steel, Aluminium & Glass Kenya" },
      {
        name: "description",
        content:
          "Steel, aluminium and glass fabrication and supplies for residential, commercial and public projects across Kenya. Based in Nairobi since 2022.",
      },
      { property: "og:title", content: "Eyetech Engineering & Supplies" },
      {
        property: "og:description",
        content:
          "Designed with precision, fabricated with strength. Steel, aluminium and glass works across Kenya.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const highlights = [
  {
    icon: "◈",
    title: "Quality Workmanship",
    text: "Quality fabrication and finishing for projects of different sizes and styles.",
  },
  {
    icon: "◆",
    title: "Complete Solutions",
    text: "From design and fabrication to supply, installation and project completion.",
  },
  {
    icon: "✓",
    title: "Built on Trust",
    text: "We focus on lasting relationships, quality products and reliable service.",
  },
];

const values = [
  { icon: "✓", title: "Quality", text: "High-quality materials and professional workmanship." },
  { icon: "◆", title: "Security", text: "Strong, reliable and practical fabrication solutions." },
  { icon: "◇", title: "Beauty", text: "Designs created to enhance homes and commercial spaces." },
  {
    icon: "♙",
    title: "Experienced Team",
    text: "Skilled engineers, designers, tradesmen and technicians.",
  },
  {
    icon: "◷",
    title: "Reliable Delivery",
    text: "Professional project coordination from fabrication to installation.",
  },
];

const projects = [
  {
    n: "01",
    title: "Architectural Metalwork",
    img: siteImages.metalwork,
    wide: true,
  },
  {
    n: "02",
    title: "Glass & Aluminium",
    img: siteImages.railing,
  },
  {
    n: "03",
    title: "Balustrades",
    img: siteImages.glazing,
  },
  {
    n: "04",
    title: "Commercial Projects",
    img: siteImages.building,
  },
  {
    n: "05",
    title: "Custom Fabrication",
    img: siteImages.kitchen,
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <HeroCarousel />
        <CaseStudyStrip />

        <section className="motion-section border-b border-border bg-white">
          <div className="mx-auto grid max-w-6xl divide-y divide-border px-4 md:grid-cols-3 md:divide-x md:divide-y-0">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="px-0 py-10 md:px-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-lg text-navy">
                  {highlight.icon}
                </span>
                <h2 className="mt-5 text-lg font-bold text-navy">{highlight.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {highlight.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <div className="relative">
              <img
                src={siteImages.workshopWide ?? siteImages.building}
                alt="Eyetech Engineering and Supplies workspace"
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 left-6 bg-navy px-6 py-4 text-white">
                <span className="text-2xl font-black text-gold">2022</span>
                <p className="text-xs uppercase tracking-widest">Established in Nairobi</p>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="About Eyetech"
                title={
                  <>
                    Turning Designs Into <span className="text-gold">Solid Reality</span>
                  </>
                }
              />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Eyetech Engineering &amp; Supplies was established in 2022 in Nairobi as a growing
                engineering and fabrication company specializing in steel, aluminium and glass
                works.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We work with homeowners, businesses, architects, contractors and institutions to
                transform ideas and designs into practical, durable and attractive installations.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-navy">
                {[
                  "Steel & stainless steel fabrication",
                  "Aluminium doors and windows",
                  "Glass partitions and installations",
                  "Architectural and decorative metal works",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-gold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/about-us"
                className="mt-8 inline-block bg-navy px-7 py-3.5 text-sm font-bold text-white hover:bg-navy-deep"
              >
                Discover Our Company →
              </Link>
            </div>
          </div>
        </section>

        <section id="ey-services" className="motion-section scroll-mt-24 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="What We Do"
              title="Our Engineering & Fabrication Services"
              intro="Explore detailed service pages for steel, aluminium, glass, kitchen and architectural fabrication solutions."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCatalog.map((service) => (
                <article
                  key={service.slug}
                  className="motion-card group border border-border bg-white"
                >
                  <Link to="/services/$slug" params={{ slug: service.slug }} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={service.hero}
                        alt={service.heroAlt}
                        loading="lazy"
                        className="motion-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-0 top-0 bg-gold px-3 py-1.5 text-xs font-black text-navy-deep">
                        {service.number}
                      </span>
                    </div>
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-navy">{service.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <span className="mt-5 inline-flex text-sm font-bold text-navy group-hover:text-gold">
                        View service details →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-navy py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Why Eyetech"
              title="Built Around Quality"
              intro="Our approach is centered around quality, security, beauty and long-term client relationships."
              light
            />
            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {values.map((value) => (
                <div key={value.title} className="bg-navy p-6">
                  <span className="text-2xl text-gold">{value.icon}</span>
                  <h2 className="mt-4 text-base font-bold text-white">{value.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ey-projects" className="motion-section scroll-mt-24 bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Our Work"
              title="Featured Projects & Fabrications"
              intro="Explore the type of architectural, fabrication and installation work we deliver."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <figure
                  key={project.n}
                  className={`group relative overflow-hidden ${project.wide ? "lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  <img
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${project.wide ? "h-full min-h-72" : "h-64"}`}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 to-transparent p-5">
                    <span className="text-xs font-bold text-gold">{project.n}</span>
                    <p className="text-base font-bold text-white">{project.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <Link
              to="/contact"
              className="mt-10 inline-block bg-navy px-7 py-3.5 text-sm font-bold text-white hover:bg-navy-deep"
            >
              Talk to Us →
            </Link>
          </div>
        </section>

        <section className="motion-section bg-navy-deep py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <span className="eyebrow justify-center text-gold">Start Your Project</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Have a Design or Project in Mind?
            </h2>
            <p className="mt-4 text-base text-white/70">
              Let Eyetech Engineering &amp; Supplies help turn your ideas into reality.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block bg-gold px-8 py-3.5 text-sm font-bold text-navy-deep hover:bg-gold-bright"
            >
              Get a Quote →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
