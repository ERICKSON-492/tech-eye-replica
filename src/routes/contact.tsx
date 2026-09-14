import { createFileRoute } from "@tanstack/react-router";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { QuoteForm } from "@/components/quote-form";
import { PageBanner } from "@/components/page-banner";
import { siteImages } from "@/lib/site-images";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | Eyetech Stainless Steel Expert Nairobi" },
      {
        name: "description",
        content:
          "Get a quote for steel, aluminium and glass fabrication from Eyetech Stainless Steel Expert in Nairobi. Call +254 717 614 427 or message us on WhatsApp.",
      },
      { property: "og:title", content: "Contact Eyetech Stainless Steel Expert" },
      {
        property: "og:description",
        content: "Talk to our Nairobi team about your steel, aluminium or glass project.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <PageBanner
          eyebrow="Contact"
          title="Have a Design or Project in Mind?"
          description="Let Eyetech Stainless Steel Expert help turn your ideas into reality."
          image={siteImages.glazing}
          imageAlt="Glass and aluminium facade representing Eyetech project work"
        />
        <section className="motion-section bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Get In Touch"
                title="Talk to Our Team"
                intro="Call us, send a WhatsApp message or share your project details and we will help you plan the next step."
              />
              <ul className="mt-8 space-y-5 text-sm">
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Phone</p>
                  <a
                    href="tel:+254717614427"
                    className="motion-link text-base font-semibold text-navy hover:text-gold"
                  >
                    +254 717 614 427
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">WhatsApp</p>
                  <a
                    href="https://wa.me/254717614427"
                    target="_blank"
                    rel="noreferrer"
                    className="motion-link text-base font-semibold text-navy hover:text-gold"
                  >
                    Message us on WhatsApp
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    Second Line
                  </p>
                  <a
                    href="tel:+254759719147"
                    className="motion-link text-base font-semibold text-navy hover:text-gold"
                  >
                    +254 759 719 147
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Email</p>
                  <a
                    href="mailto:eyetechengineering3@gmail.com"
                    className="motion-link text-base font-semibold text-navy hover:text-gold"
                  >
                    eyetechengineering3@gmail.com
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Location</p>
                  <p className="text-base font-semibold text-navy">
                    Pipeline off Outer-ring Road, Nairobi, Kenya
                  </p>
                </li>
              </ul>
              <div className="motion-card mt-10 border-l-2 border-gold bg-surface p-5 text-sm leading-relaxed text-muted-foreground">
                Helpful information includes your project location, drawings, approximate
                dimensions, reference images and preferred timeline.
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
