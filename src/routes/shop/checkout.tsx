import { Link, createFileRoute } from "@tanstack/react-router";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { useCart } from "@/components/cart-provider";
import { formatKes } from "@/lib/shop";
import { useState } from "react";

export const Route = createFileRoute("/shop/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout | Eyetech Engineering & Supplies" },
      {
        name: "description",
        content:
          "Review your Eyetech shop request and submit customer details for order processing.",
      },
    ],
    links: [{ rel: "canonical", href: "/shop/checkout" }],
  }),
});

function CheckoutPage() {
  const { lines, subtotal, setQuantity, remove, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (!lines.length && !submitted) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header />
        <main id="main" className="mx-auto max-w-3xl px-4 py-24 text-center">
          <span className="eyebrow justify-center text-gold">Your cart</span>
          <h1 className="mt-4 text-4xl font-black text-navy">Your cart is empty</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Browse the starter catalog or contact the team for a project-specific quotation.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex bg-navy px-7 py-3.5 text-sm font-bold text-white"
          >
            Browse the shop →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <Header />
        <main id="main" className="mx-auto max-w-3xl px-4 py-24 text-center">
          <span className="eyebrow justify-center text-gold">Request received</span>
          <h1 className="mt-4 text-4xl font-black text-navy">
            Your order request is ready for Supabase processing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Connect your Supabase project and payment provider to persist this request, send
            confirmation, and begin checkout.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex bg-navy px-7 py-3.5 text-sm font-bold text-white"
          >
            Continue shopping →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-12">
          <span className="eyebrow text-gold">Checkout-ready request</span>
          <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Review your cart</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            This form is ready to create a Supabase order and redirect to your selected payment
            provider once configured.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section
            className="border border-border bg-white p-6 sm:p-8"
            aria-labelledby="cart-heading"
          >
            <h2 id="cart-heading" className="text-2xl font-black text-navy">
              Items
            </h2>
            <div className="mt-6 divide-y divide-border">
              {lines.map((line) => (
                <div key={line.product.id} className="flex gap-4 py-5">
                  <img src={line.product.image} alt="" className="h-20 w-20 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-navy">{line.product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatKes(line.product.priceKes)} each
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                        className="min-h-9 min-w-9 border border-border text-navy"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                        className="min-h-9 min-w-9 border border-border text-navy"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(line.product.id)}
                        className="ml-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-black text-navy">
                    {formatKes(line.product.priceKes * line.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={clear}
              className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-navy"
            >
              Clear cart
            </button>
          </section>
          <form
            className="border border-border bg-white p-6 sm:p-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <h2 className="text-2xl font-black text-navy">Customer details</h2>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-navy">
                Full name
                <input
                  required
                  name="name"
                  className="border border-border bg-background px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Phone / WhatsApp
                <input
                  required
                  name="phone"
                  type="tel"
                  className="border border-border bg-background px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  className="border border-border bg-background px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Delivery or project location
                <textarea
                  required
                  name="location"
                  rows={3}
                  className="border border-border bg-background px-4 py-3 font-normal outline-none focus:border-gold"
                />
              </label>
            </div>
            <div className="mt-8 border-t border-border pt-5">
              <div className="flex justify-between text-lg font-black text-navy">
                <span>Estimated subtotal</span>
                <span>{formatKes(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Final fabrication, delivery, installation, tax and payment fees are confirmed before
                payment.
              </p>
              <button
                type="submit"
                className="mt-6 w-full bg-gold px-6 py-3.5 text-sm font-bold text-navy-deep hover:bg-gold-bright"
              >
                Continue to payment setup →
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
