import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { PageBanner } from "@/components/page-banner";
import { siteImages } from "@/lib/site-images";

export const Route = createFileRoute("/about-us")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Eyetech Stainless Steel Expert | Nairobi" },
      {
        name: "description",
        content:
          "Learn about Eyetech Stainless Steel Expert, a Nairobi-based steel, aluminium and glass fabrication company established in 2022.",
      },
      { property: "og:title", content: "About Eyetech Stainless Steel Expert" },
      {
        property: "og:description",
        content:
          "We build trust through quality, security and beauty in steel, aluminium and glass fabrication projects.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about-us" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about-us" }],
  }),
});

const capabilities = [
  "Steel, stainless-steel and architectural metalwork",
  "Aluminium doors, windows, shopfronts and curtain walls",
  "Glass partitions, frameless doors and shower doors",
  "Structural glazing, double-glazed glass and mirrors",
  "Staircase systems, handrails and balcony railings",
  "Cladding, decorative articles and custom-made products",
  "Commercial, residential and public-building work",
  "New construction, renovation and annual maintenance support",
];

const values = [
  {
    title: "Trust",
    text: "We operate on trust and focus on long-lasting relationships with our clients.",
  },
  {
    title: "Quality",
    text: "We aim to deliver high-quality products and cost-effective services to the agreed scope.",
  },
  {
    title: "Security",
    text: "We design and fabricate practical solutions with strength, safety and dependable use in mind.",
  },
  {
    title: "Beauty",
    text: "We combine technical fabrication with details that enhance homes, buildings and public spaces.",
  },
  {
    title: "Technical capability",
    text: "Our technical team works with different aluminium sections, glass types and available fittings to suit each application.",
  },
  {
    title: "Client partnership",
    text: "We welcome feedback and use clear communication to keep projects moving toward a successful completion.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main id="main">
        <PageBanner
          eyebrow="About Eyetech"
          title={
            <>
              We Build Trust, <span className="text-gold">Quality, Security &amp; Beauty</span>
            </>
          }
          description="Eyetech Stainless Steel Expert is a Nairobi-based fabrication and supplies company working with steel, aluminium and glass for residential, commercial and public projects."
          image={siteImages.building}
          imageAlt="Modern building facade representing Eyetech engineering and fabrication work"
        />

        <section className="motion-section bg-white py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="Turning ideas and designs into solid reality"
              />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Eyetech Stainless Steel Expert was established as a sole proprietorship under the
                ownership of Amos Mwangi in 2022 in Nairobi. From a modest beginning, the company
                has progressed through the work of a dedicated technical team and a growing
                understanding of modern steel, aluminium and glass fabrication.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Based in the Pipeline area of Nairobi, Eyetech serves projects in Nairobi and other
                counties. The company works with homeowners, businesses, architects, contractors and
                institutions to turn practical requirements and creative ideas into finished work.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Our work ranges from residential homes and villas to commercial buildings, shopping
                spaces, housing complexes and educational institutions across public and private
                sectors.
              </p>
              <Link
                to="/contact"
                className="motion-link mt-8 inline-block bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright"
              >
                Talk to Our Team →
              </Link>
            </div>
            <div className="motion-card border-l-2 border-gold bg-surface p-7">
              <p className="eyebrow text-gold">Company profile</p>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="font-bold uppercase tracking-widest text-navy">Established</dt>
                  <dd className="mt-1 text-muted-foreground">2022, Nairobi</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-navy">Base</dt>
                  <dd className="mt-1 text-muted-foreground">Pipeline area, Nairobi</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-navy">Core focus</dt>
                  <dd className="mt-1 text-muted-foreground">
                    Steel, aluminium, glass and architectural décor
                  </dd>
                </div>
                <div>
                  <dt className="font-bold uppercase tracking-widest text-navy">Contact</dt>
                  <dd className="mt-1 text-muted-foreground">
                    +254 717 614 427 · +254 759 719 147
                    <br />
                    eyetechengineering3@gmail.com
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Our direction"
              title="A practical vision for modern spaces"
              intro="The company profile sets out a clear direction for how Eyetech approaches fabrication, design and service."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <article className="motion-card border border-border bg-white p-7">
                <span className="text-3xl font-black text-gold">01</span>
                <h2 className="mt-5 text-lg font-bold text-navy">Our vision</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To help redefine construction through steel, aluminium and glass décor.
                </p>
              </article>
              <article className="motion-card border border-border bg-white p-7">
                <span className="text-3xl font-black text-gold">02</span>
                <h2 className="mt-5 text-lg font-bold text-navy">Our mission</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To undertake steel and aluminium décor projects with an assurance of quality,
                  security and beauty, using current technology, equipment and machinery.
                </p>
              </article>
              <article className="motion-card border border-border bg-white p-7">
                <span className="text-3xl font-black text-gold">03</span>
                <h2 className="mt-5 text-lg font-bold text-navy">Our objective</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To explore advances in stainless steel, aluminium and glass decoration for the
                  modernization of Kenya and East African countries.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Our strength"
                title="Technical capability for projects of different sizes"
              />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The company profile describes a fabrication environment equipped for stainless
                steel, aluminium and glass work, supported by engineers, draughtsmen, designers,
                technicians, tradesmen and estimators.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                This mix of technical and practical experience supports projects that require
                careful design, measurement, fabrication, fitting and installation. The team works
                with a range of aluminium sections, glass types and fittings to select suitable
                solutions for each use.
              </p>
            </div>
            <div className="motion-card bg-navy p-7 text-white">
              <p className="eyebrow text-gold">Specialist capabilities</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex gap-2 text-sm leading-relaxed text-white/75">
                    <span className="text-gold" aria-hidden="true">
                      ◆
                    </span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="What guides us"
              title="Trust, quality, security and beauty"
              intro="These principles shape the way Eyetech approaches client relationships, fabrication and project delivery."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="motion-card border border-border bg-white p-6"
                >
                  <h2 className="text-base font-bold text-navy">{value.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-navy-deep py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <span className="eyebrow justify-center text-gold">Start a conversation</span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Have a steel, aluminium or glass project in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
              Share your drawings, dimensions, reference images or project requirements and let us
              discuss the most practical next step.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="motion-link bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright"
              >
                Request a Quote →
              </Link>
              <a
                href="https://wa.me/254717614427"
                target="_blank"
                rel="noreferrer"
                className="motion-link border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
