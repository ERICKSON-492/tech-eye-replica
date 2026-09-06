import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { PageBanner } from "@/components/page-banner";
import { services } from "@/lib/services";
import { siteImages } from "@/lib/site-images";

export const Route = createFileRoute("/services/")({
  component: ServicesIndex,
  head: () => ({
    meta: [
      { title: "Services | Eyetech Engineering & Supplies Kenya" },
      {
        name: "description",
        content:
          "Explore steel, aluminium, glass and architectural fabrication services from Eyetech Engineering & Supplies in Nairobi and across Kenya.",
      },
      { property: "og:title", content: "Services | Eyetech Engineering & Supplies" },
      {
        property: "og:description",
        content:
          "Explore Eyetech's fabrication, glazing, aluminium, kitchen and architectural metalwork services.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <PageBanner
          eyebrow="What we do"
          title={
            <>
              Engineering and fabrication services for{" "}
              <span className="text-gold">real spaces</span>
            </>
          }
          description="From steel fabrication and aluminium works to architectural glazing, kitchens and custom metalwork, we help turn designs and project requirements into finished installations."
          image={siteImages.steel}
          imageAlt="Eyetech workshop fabrication environment"
        >
          <a
            href="#service-list"
            className="motion-link bg-gold px-6 py-3.5 text-sm font-bold text-navy-deep hover:bg-gold-bright"
          >
            Explore services →
          </a>
          <Link
            to="/contact"
            className="motion-link border border-white/40 px-6 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-navy"
          >
            Request a quote
          </Link>
        </PageBanner>

        <section id="service-list" className="motion-section scroll-mt-24 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Our services"
              title="Choose a service to explore"
              intro="Each service page explains the scope, applications, options, process and next steps for your project."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.slug}
                  className="motion-card group overflow-hidden border border-border bg-white"
                >
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
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <Link
                      to="/services/$slug"
                      params={{ slug: service.slug }}
                      className="motion-link mt-6 inline-flex text-sm font-bold text-navy hover:text-gold"
                    >
                      View service details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Complete solutions"
                  title="From first conversation to finished installation"
                  intro="Tell us what you are planning, share your drawings or photos, and we can help identify the right fabrication or installation route."
                />
                <Link
                  to="/contact"
                  className="motion-link mt-8 inline-flex bg-navy px-7 py-3.5 text-sm font-bold text-white hover:bg-navy-deep"
                >
                  Talk to our team →
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="motion-card border border-border bg-white p-6">
                  <span className="text-2xl font-black text-gold">01</span>
                  <h3 className="mt-4 font-bold text-navy">Design and planning</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Discuss drawings, dimensions and project requirements.
                  </p>
                </div>
                <div className="motion-card border border-border bg-white p-6">
                  <span className="text-2xl font-black text-gold">02</span>
                  <h3 className="mt-4 font-bold text-navy">Fabrication and supply</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Prepare and finish the agreed solution.
                  </p>
                </div>
                <div className="motion-card border border-border bg-white p-6">
                  <span className="text-2xl font-black text-gold">03</span>
                  <h3 className="mt-4 font-bold text-navy">Installation</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Coordinate delivery, installation and handover.
                  </p>
                </div>
                <div className="motion-card border border-border bg-white p-6">
                  <span className="text-2xl font-black text-gold">04</span>
                  <h3 className="mt-4 font-bold text-navy">Project support</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Stay aligned as the work moves forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
