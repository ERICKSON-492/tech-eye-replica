import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, TopBar, Footer, SectionHeading } from "@/components/site-chrome";

export const Route = createFileRoute("/about-us")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Eyetech Engineering & Supplies" },
      {
        name: "description",
        content:
          "Eyetech Engineering & Supplies is a Nairobi-based steel, aluminium and glass fabrication company established in 2022, serving clients across Kenya.",
      },
      { property: "og:title", content: "About Eyetech Engineering & Supplies" },
      {
        property: "og:description",
        content:
          "A Nairobi engineering and fabrication company specializing in steel, aluminium and glass works since 2022.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about-us" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about-us" }],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main id="main">
        <section className="motion-section relative isolate overflow-hidden bg-navy-deep py-20">
          <div className="mx-auto max-w-6xl px-4">
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" />
              About Us
            </span>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Engineering, Fabrication and Supplies in Nairobi
            </h1>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Our Story" title="Turning Designs Into Solid Reality" />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Eyetech Engineering &amp; Supplies was established in 2022 in Nairobi as a growing
                engineering and fabrication company specializing in steel, aluminium and glass
                works.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We work with homeowners, businesses, architects, contractors and institutions to
                transform ideas and designs into practical, durable and attractive installations —
                from design and fabrication through to supply, installation and project completion.
              </p>
              <Link
                to="/contact"
                className="motion-link mt-8 inline-block bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright"
              >
                Talk to Us →
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85"
              alt="Stainless steel fabrication work"
              loading="lazy"
              className="motion-image w-full object-cover"
            />
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading eyebrow="What Guides Us" title="Built Around Quality" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Quality", text: "High-quality materials and professional workmanship." },
                {
                  title: "Security",
                  text: "Strong, reliable and practical fabrication solutions.",
                },
                {
                  title: "Beauty",
                  text: "Designs created to enhance homes and commercial spaces.",
                },
                {
                  title: "Experienced Team",
                  text: "Skilled engineers, designers, tradesmen and technicians.",
                },
                {
                  title: "Reliable Delivery",
                  text: "Professional project coordination from fabrication to installation.",
                },
                {
                  title: "Lasting Relationships",
                  text: "We focus on trust, quality products and reliable service.",
                },
              ].map((v) => (
                <div key={v.title} className="motion-card border border-border bg-white p-6">
                  <h3 className="text-base font-bold text-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
