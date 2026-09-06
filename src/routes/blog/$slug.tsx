import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { blogPosts, formatPostDate, getPost } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found | Eyetech Engineering & Supplies" }],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} | Eyetech Engineering & Supplies` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function PostNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main" className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-navy">Article not found</h1>
        <p className="mt-4 text-muted-foreground">
          That article may have been moved or renamed.
        </p>
        <Link
          to="/blog"
          className="motion-link mt-8 inline-flex bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-deep"
        >
          Back to the blog →
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <section className="motion-section bg-navy-deep py-16">
          <div className="mx-auto max-w-3xl px-4">
            <Link to="/blog" className="motion-link text-xs font-bold uppercase tracking-widest text-gold">
              ← Back to blog
            </Link>
            <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-sm font-medium text-white/60">
              {post.category} · {formatPostDate(post.date)} · {post.readTime}
            </p>
          </div>
        </section>

        <section className="motion-section bg-white py-14">
          <div className="mx-auto max-w-3xl px-4">
            <img
              src={post.image}
              alt={post.imageAlt}
              loading="lazy"
              className="w-full object-cover"
            />
            <p className="mt-8 text-lg leading-relaxed text-navy">{post.excerpt}</p>
            {post.body.map((section) => (
              <div key={section.heading} className="mt-10">
                <h2 className="text-xl font-bold text-navy">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            <div className="motion-card mt-14 flex flex-col gap-4 border border-gold/40 bg-gold/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-navy">
                <strong>Planning something similar?</strong> Share your measurements or drawings and
                we will talk you through the options.
              </p>
              <Link
                to="/contact"
                className="motion-link inline-flex min-h-11 shrink-0 items-center justify-center bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-navy-deep"
              >
                Request a quote →
              </Link>
            </div>
          </div>
        </section>

        <section className="motion-section bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-black text-navy">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="motion-card border border-border bg-white p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                    {item.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-tight text-navy">{item.title}</h3>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="motion-link mt-5 inline-flex min-h-11 items-center text-sm font-bold text-navy hover:text-gold"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
