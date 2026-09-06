import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer, Header, SectionHeading, TopBar } from "@/components/site-chrome";
import { blogPosts, formatPostDate } from "@/lib/blog";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog | Eyetech Engineering & Supplies Kenya" },
      {
        name: "description",
        content:
          "Practical guides on steel, aluminium and glass works in Kenya — choosing railings, specifying windows, caring for finishes and how a fabrication project runs.",
      },
      { property: "og:title", content: "Blog | Eyetech Engineering & Supplies" },
      {
        property: "og:description",
        content:
          "Guides and advice on steel, aluminium and glass fabrication from the Eyetech team in Nairobi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <section className="motion-section bg-navy-deep py-20">
          <div className="mx-auto max-w-6xl px-4">
            <span className="eyebrow text-gold">
              <span className="h-px w-8 bg-gold" />
              Insights
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Notes from the <span className="text-gold">workshop</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              Practical advice on steel, aluminium and glass works — written for homeowners,
              builders and project managers planning their next installation.
            </p>
          </div>
        </section>

        <section className="motion-section bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <article className="motion-card grid gap-8 border border-border bg-white lg:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-10">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {featured.category} · {formatPostDate(featured.date)}
                </span>
                <h2 className="mt-4 text-2xl font-black leading-tight text-navy sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: featured.slug }}
                  className="motion-link mt-8 inline-flex min-h-11 items-center bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-deep"
                >
                  Read the article →
                </Link>
              </div>
            </article>

            <div className="mt-14">
              <SectionHeading
                eyebrow="More articles"
                title="Guides, materials and maintenance"
                intro="Short reads covering the questions we are asked most often."
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <article
                    key={post.slug}
                    className="motion-card group overflow-hidden border border-border bg-white"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.imageAlt}
                        loading="lazy"
                        className="motion-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                        {post.category} · {post.readTime}
                      </span>
                      <h3 className="mt-3 text-lg font-bold leading-tight text-navy">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="motion-link mt-6 inline-flex min-h-11 items-center text-sm font-bold text-navy hover:text-gold"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
