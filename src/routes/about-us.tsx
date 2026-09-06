import { createFileRoute, Link } from "@tanstack/react-router";
import { siteImages } from "@/lib/site-images";
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
                Eyetech Engineering &amp; Supplies was established in 2022 in Nairobi as a sole
                proprietorship under the ownership of Mr. Amos Mwangi. From a modest start, the
                company has grown steadily through a dedicated technical team working towards
                becoming one of the best in stainless steel, aluminium and glass decor works in
                Kenya.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We are based in the Pipeline area of Nairobi and work across the county and beyond,
                handling everything in steel, aluminium and glass — from artistically designed
                stainless steel and glass patterns for homes to aluminium windows and doors for
                commercial developments, shopping malls, housing complexes and institutions.
              </p>
              <Link
                to="/contact"
                className="motion-link mt-8 inline-block bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright"
              >
                Talk to Us →
              </Link>
            </div>
            <img
              src={siteImages.steel}
              alt="Stainless steel fabrication work"
              loading="lazy"
              className="motion-image w-full object-cover"
            />
          </div>
        </section>

        <section className="motion-section bg-navy py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Vision, Mission & Objective"
              title="What We Are Working Towards"
              light
            />
            <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
              {[
                {
                  title: "Our Vision",
                  text: "Eyetech Engineering & Supplies is redefining construction with steel, aluminium and glass decor.",
                },
                {
                  title: "Our Mission",
                  text: "To undertake all kinds of steel and aluminium decor projects with an assurance of the best quality, security and beauty, using modern equipment and machinery in residential homes and buildings, commercial and public offices and buildings.",
                },
                {
                  title: "Our Objective",
                  text: "To explore the advanced technology of stainless steel, aluminium and glass decoration works towards the modernization of Kenya and East African countries.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-navy p-7">
                  <h3 className="text-base font-bold text-gold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
            {[
              {
                title: "Our Strength",
                text: "We have the capacity to handle large stainless steel, aluminium and glass works, with a complete set of modern fabrication machines operated under the supervision of professional engineers, draughtsmen, designers and technicians.",
              },
              {
                title: "Company Philosophy",
                text: "We operate on trust and build long-lasting relationships with our clients, offering cost-effective service, high-quality products and completion on schedule.",
              },
              {
                title: "Our Team",
                text: "Our tradesmen and estimators handle projects of all sizes and styles, and specialise in curtain walling, structural glazing, frameless glass, shower doors, double-glazed glass, mirrors, designer glass and aluminium composite cladding.",
              },
            ].map((item) => (
              <div key={item.title} className="motion-card border-l-2 border-gold bg-surface p-6">
                <h3 className="text-base font-bold text-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
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
