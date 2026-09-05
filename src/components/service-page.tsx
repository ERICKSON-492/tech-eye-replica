import { Link } from "@tanstack/react-router";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { QuoteForm } from "@/components/quote-form";
import type { Service } from "@/lib/services";

const process = [
  {
    number: "01",
    title: "Consultation",
    text: "Tell us what you want to build, improve or install.",
  },
  {
    number: "02",
    title: "Site review",
    text: "We discuss measurements, drawings, access and project conditions.",
  },
  {
    number: "03",
    title: "Quotation",
    text: "Confirm the scope, materials, finish and expected timeline.",
  },
  {
    number: "04",
    title: "Fabrication",
    text: "Our team prepares the agreed solution with care and precision.",
  },
  {
    number: "05",
    title: "Installation",
    text: "We coordinate delivery, installation and project handover.",
  },
];

export function ServicePage({ service }: { service: Service }) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <section className="motion-section bg-navy-deep py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <nav aria-label="Breadcrumb" className="text-xs font-medium text-white/60">
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
              <span className="px-2" aria-hidden="true">
                /
              </span>
              <Link to="/services" className="hover:text-gold">
                Services
              </Link>
              <span className="px-2" aria-hidden="true">
                /
              </span>
              <span className="text-white/85">{service.shortTitle}</span>
            </nav>
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <span className="eyebrow text-gold">
                  <span className="h-px w-8 bg-gold" />
                  {service.shortTitle}
                </span>
                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] text-white sm:text-6xl">
                  {service.title} <span className="text-gold">Built for Your Project</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
                  {service.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#quote"
                    className="motion-link bg-gold px-6 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-gold-bright"
                  >
                    Request a Quote →
                  </a>
                  <a
                    href="https://wa.me/254717614427"
                    target="_blank"
                    rel="noreferrer"
                    className="motion-link border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-navy"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.hero}
                  alt={service.heroAlt}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-0 top-0 bg-gold px-3 py-1.5 text-xs font-black text-navy-deep">
                  {service.number}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="motion-section border-b border-border bg-white">
          <div className="mx-auto grid max-w-6xl divide-y divide-border px-4 md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              ["2022", "Established in Nairobi"],
              ["End-to-end", "Design, fabrication and installation"],
              ["Kenya", "Residential, commercial and public projects"],
            ].map(([value, label]) => (
              <div key={label} className="px-0 py-7 md:px-8">
                <p className="text-xl font-black text-navy">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="About this service"
                title={
                  <>
                    Practical work, <span className="text-gold">carefully finished</span>
                  </>
                }
              />
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {service.intro}
              </p>
              <a
                href="#quote"
                className="motion-link mt-8 inline-flex bg-navy px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep"
              >
                Talk to an expert →
              </a>
            </div>
            <img
              src={service.projects[0]?.image}
              alt={service.projects[0]?.title ?? service.title}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="What we provide"
              title={`Solutions for ${service.shortTitle.toLowerCase()}`}
              intro="Choose a focused solution or combine several elements into one coordinated project."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.offerings.map((offering, index) => (
                <article key={offering} className="motion-card border border-border bg-white p-6">
                  <span className="text-3xl font-black text-gold">0{index + 1}</span>
                  <h3 className="mt-5 text-base font-bold text-navy">{offering}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Planned, fabricated and finished around the requirements of your space.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Applications"
              title="Where this service is used"
              intro="We tailor the scope, materials and finish to the type of project and the way the space will be used."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {service.applications.map((application, index) => (
                <div key={application} className="motion-card border border-border bg-white p-7">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy">{application}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    We can discuss your priorities, site conditions and expected outcome during
                    consultation.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Options and specifications"
              title="Choose the right fit for your project"
              intro="The final specification depends on your site, use, design intent and budget. We can help you make a practical selection."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {service.options.map((option) => (
                <div
                  key={option.label}
                  className="motion-card border-l-2 border-gold bg-surface p-6"
                >
                  <h3 className="text-base font-bold text-navy">{option.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {option.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-navy py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Our process"
              title="A clear route from idea to installation"
              intro="Good fabrication begins with a clear brief and ends with a careful handover."
              light
            />
            <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-5">
              {process.map((step) => (
                <div key={step.number} className="motion-card bg-navy p-6">
                  <span className="text-2xl font-black text-gold">{step.number}</span>
                  <h3 className="mt-5 text-base font-bold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Selected work"
              title={`Recent ${service.shortTitle.toLowerCase()} projects`}
              intro="Use this section for verified project photography, locations and case-study links as the portfolio grows."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {service.projects.map((project, index) => (
                <article key={project.title} className="motion-card group overflow-hidden bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="motion-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-0 top-0 bg-gold px-3 py-1.5 text-xs font-black text-navy-deep">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-bold text-navy">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{project.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Why Eyetech"
              title={`Why choose us for ${service.shortTitle.toLowerCase()}?`}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "01",
                  "Clear communication",
                  "Confirm scope, measurements and finish before fabrication.",
                ],
                [
                  "02",
                  "Complete handling",
                  "Coordinate fabrication, supply and installation in one process.",
                ],
                [
                  "03",
                  "Practical guidance",
                  "Discuss materials, options and details suited to your project.",
                ],
                ["04", "Reliable finishing", "Inspect the completed work before project handover."],
              ].map(([number, title, text]) => (
                <div key={number} className="border border-border p-6">
                  <span className="text-2xl font-black text-gold">{number}</span>
                  <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-20">
          <div className="mx-auto max-w-4xl px-4">
            <SectionHeading
              eyebrow="Frequently asked questions"
              title={`Questions about ${service.shortTitle.toLowerCase()}?`}
            />
            <div className="mt-10 divide-y divide-border border-y border-border">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-navy">
                    <span>{faq.question}</span>
                    <span
                      className="text-xl text-gold transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="quote" className="scroll-mt-24 bg-navy-deep py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow text-gold">
                <span className="h-px w-8 bg-gold" />
                Start your project
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">
                Ready to discuss your {service.shortTitle.toLowerCase()} project?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                Send us your drawings, measurements, photos or project requirements. We will help
                define the right next step.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/75">
                <a href="tel:+254717614427" className="block hover:text-gold">
                  +254 717 614 427
                </a>
                <a
                  href="https://wa.me/254717614427"
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-gold"
                >
                  Message us on WhatsApp
                </a>
                <span className="block">Nairobi, Kenya</span>
              </div>
            </div>
            <QuoteForm initialService={service.title} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
