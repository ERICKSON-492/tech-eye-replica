import { createFileRoute } from "@tanstack/react-router";
import { Header, TopBar, Footer, SectionHeading } from "@/components/site-chrome";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | Eyetech Engineering & Supplies Nairobi" },
      {
        name: "description",
        content:
          "Get a quote for steel, aluminium and glass fabrication from Eyetech Engineering & Supplies in Nairobi. Call +254 717 614 427 or message us on WhatsApp.",
      },
      { property: "og:title", content: "Contact Eyetech Engineering & Supplies" },
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
        <section className="bg-navy-deep py-20">
          <div className="mx-auto max-w-6xl px-4">
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" />
              Contact
            </span>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl">
              Have a Design or Project in Mind?
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/70">
              Let Eyetech Engineering &amp; Supplies help turn your ideas into reality.
            </p>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Get In Touch"
                title="Talk to Our Team"
                intro="Call us, send a WhatsApp message or write to us about your project and we will get back to you."
              />
              <ul className="mt-8 space-y-5 text-sm">
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Phone</p>
                  <a href="tel:+254717614427" className="text-base font-semibold text-navy">
                    +254 717 614 427
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">WhatsApp</p>
                  <a
                    href="https://wa.me/254717614427"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-semibold text-navy"
                  >
                    Message us on WhatsApp
                  </a>
                </li>
                <li>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Location</p>
                  <p className="text-base font-semibold text-navy">Nairobi, Kenya</p>
                </li>
              </ul>
            </div>

            <form
              className="border border-border bg-surface p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                const f = e.currentTarget as HTMLFormElement;
                const data = new FormData(f);
                const text = `Hello Eyetech, I'm ${data.get("name")} (${data.get("phone")}). ${data.get("message")}`;
                window.open(
                  `https://wa.me/254717614427?text=${encodeURIComponent(text)}`,
                  "_blank",
                );
              }}
            >
              <h2 className="text-lg font-bold text-navy">Request a Quote</h2>
              <div className="mt-5 space-y-4">
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                />
                <input
                  name="phone"
                  required
                  placeholder="Phone number"
                  className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project"
                  className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="w-full bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep"
                >
                  Send via WhatsApp →
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
