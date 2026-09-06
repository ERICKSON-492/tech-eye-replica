import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { PageBanner } from "@/components/page-banner";
import { useCart } from "@/components/cart-provider";
import { formatKes, starterProducts } from "@/lib/shop";
import { useState } from "react";

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop | Eyetech Engineering & Supplies" },
      {
        name: "description",
        content: "Browse Eyetech fabrication products and request a project-ready quote.",
      },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
});

function ShopPage() {
  const { add, itemCount } = useCart();
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(starterProducts.map((product) => product.category))];
  const products =
    category === "All"
      ? starterProducts
      : starterProducts.filter((product) => product.category === category);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main">
        <PageBanner
          eyebrow="Eyetech shop"
          title={
            <>
              Fabrication products for <span className="text-gold">real projects</span>
            </>
          }
          description="Browse starter product categories, then request a project-specific quotation. Live inventory and checkout can be connected to Supabase and your chosen payment provider."
          image="/src/assets/workshop.jpg"
          imageAlt="Eyetech workshop fabrication environment"
        >
          <Link
            to="/shop/checkout"
            className="motion-link bg-gold px-6 py-3.5 text-sm font-bold text-navy-deep hover:bg-gold-bright"
          >
            View cart ({itemCount}) →
          </Link>
        </PageBanner>

        <section className="motion-section bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="eyebrow text-gold">Catalog</span>
                <h2 className="mt-3 text-3xl font-black text-navy sm:text-4xl">
                  Select a product family
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Prices shown are starter estimates. Final pricing depends on measurements,
                  materials, finish, access and installation requirements.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Product categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={category === item}
                    onClick={() => setCategory(item)}
                    className="min-h-11 shrink-0 border border-border px-4 text-xs font-bold uppercase tracking-widest text-navy transition-colors hover:border-gold hover:text-gold aria-pressed:bg-navy aria-pressed:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="motion-card overflow-hidden border border-border bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className="motion-image h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold">
                      {product.category}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-navy">{product.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{product.unit}</p>
                        <p className="text-lg font-black text-navy">
                          {formatKes(product.priceKes)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => add(product)}
                        className="min-h-11 bg-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-navy-deep"
                      >
                        Add
                      </button>
                    </div>
                  </div>
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
