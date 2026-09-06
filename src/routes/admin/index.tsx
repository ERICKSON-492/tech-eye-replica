import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { formatKes } from "@/lib/shop";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Eyetech Engineering & Supplies" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price_kes: number;
  stock_quantity: number;
  active: boolean;
};
type OrderRow = {
  id: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total_kes: number;
  created_at: string;
};
const productFields = [
  ["sku", "SKU"],
  ["name", "Name"],
  ["slug", "Slug"],
  ["category", "Category"],
  ["price_kes", "Price (KES)"],
  ["stock_quantity", "Stock quantity"],
] as const;

function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setLoading(false);
      return;
    }
    setSessionEmail(user.email ?? null);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    setRole(profile?.role ?? null);
    if (profile?.role !== "admin") {
      setLoading(false);
      return;
    }
    const [{ data: productRows }, { data: orderRows }] = await Promise.all([
      supabase
        .from("products")
        .select("id, sku, name, category, price_kes, stock_quantity, active")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id, customer_name, status, payment_status, total_kes, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    setProducts((productRows ?? []) as ProductRow[]);
    setOrders((orderRows ?? []) as OrderRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setMessage(error ? error.message : "Signed in. Loading your admin permissions…");
    if (!error) void loadDashboard();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSessionEmail(null);
    setRole(null);
    setProducts([]);
    setOrders([]);
  };

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("products").insert({
      sku: String(form.get("sku")),
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      category: String(form.get("category")),
      description: String(form.get("description")),
      price_kes: Number(form.get("price_kes")),
      stock_quantity: Number(form.get("stock_quantity")),
      active: true,
    });
    setMessage(error ? error.message : "Product created.");
    if (!error) {
      event.currentTarget.reset();
      void loadDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="eyebrow text-gold">Protected workspace</span>
            <h1 className="mt-4 text-4xl font-black text-navy sm:text-5xl">Store administration</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Products, stock, order states and customer requests will be governed by Supabase Auth
              and Row Level Security.
            </p>
          </div>
          {sessionEmail && (
            <button
              type="button"
              onClick={signOut}
              className="min-h-11 border border-border px-4 text-xs font-bold uppercase tracking-widest text-navy"
            >
              Sign out
            </button>
          )}
        </div>
        {!isSupabaseConfigured && (
          <div className="mt-10 border-l-2 border-gold bg-gold/10 p-5 text-sm leading-relaxed text-navy">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to the
            deployment environment, then run the SQL in <code>supabase/schema.sql</code> before
            activating this dashboard.
          </div>
        )}
        {isSupabaseConfigured && !sessionEmail && (
          <form
            onSubmit={signIn}
            className="mx-auto mt-12 max-w-md border border-border bg-white p-7"
          >
            <h2 className="text-2xl font-black text-navy">Admin sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use a Supabase Auth account promoted to the admin role in the profiles table.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-navy">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  className="border border-border bg-background px-4 py-3 font-normal"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Password
                <input
                  required
                  name="password"
                  type="password"
                  className="border border-border bg-background px-4 py-3 font-normal"
                />
              </label>
              <button
                type="submit"
                className="min-h-11 bg-navy px-5 py-3 text-sm font-bold text-white"
              >
                Sign in securely
              </button>
            </div>
          </form>
        )}
        {isSupabaseConfigured && sessionEmail && role !== "admin" && (
          <div className="mt-10 border border-red-200 bg-red-50 p-6 text-red-900">
            <h2 className="font-bold">Admin permission required</h2>
            <p className="mt-2 text-sm">
              The signed-in account does not have the admin role. Promote it in Supabase only after
              verifying the account owner.
            </p>
          </div>
        )}
        {isSupabaseConfigured && sessionEmail && role === "admin" && (
          <div className="mt-10 space-y-10">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">Products</p>
                <p className="mt-2 text-3xl font-black text-navy">{products.length}</p>
              </div>
              <div className="border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Recent orders
                </p>
                <p className="mt-2 text-3xl font-black text-navy">{orders.length}</p>
              </div>
              <div className="border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">Account</p>
                <p className="mt-2 truncate text-sm font-bold text-navy">{sessionEmail}</p>
              </div>
            </div>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <form onSubmit={createProduct} className="border border-border bg-white p-6">
                <h2 className="text-2xl font-black text-navy">Add product</h2>
                <div className="mt-5 grid gap-3">
                  {productFields.map(([name, label]) => (
                    <label
                      key={name}
                      className="grid gap-1 text-xs font-bold uppercase tracking-widest text-navy"
                    >
                      {label}
                      <input
                        required
                        name={name}
                        type={name.includes("price") || name.includes("stock") ? "number" : "text"}
                        className="border border-border bg-background px-3 py-2.5 text-sm font-normal normal-case tracking-normal"
                      />
                    </label>
                  ))}
                  <label className="grid gap-1 text-xs font-bold uppercase tracking-widest text-navy">
                    Description
                    <textarea
                      required
                      name="description"
                      rows={3}
                      className="border border-border bg-background px-3 py-2.5 text-sm font-normal normal-case tracking-normal"
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-2 min-h-11 bg-gold px-5 py-3 text-sm font-bold text-navy-deep"
                  >
                    Create product
                  </button>
                </div>
              </form>
              <div className="space-y-8">
                <section className="border border-border bg-white p-6">
                  <h2 className="text-2xl font-black text-navy">Products</h2>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                          <th className="py-3">Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-border">
                            <td className="py-3 font-bold text-navy">
                              {product.name}
                              <span className="block text-xs font-normal text-muted-foreground">
                                {product.sku}
                              </span>
                            </td>
                            <td>{product.category}</td>
                            <td>{formatKes(product.price_kes)}</td>
                            <td>{product.stock_quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="border border-border bg-white p-6">
                  <h2 className="text-2xl font-black text-navy">Recent orders</h2>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                          <th className="py-3">Customer</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-border">
                            <td className="py-3 font-bold text-navy">
                              {order.customer_name}
                              <span className="block text-xs font-normal text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td>{order.status}</td>
                            <td>{order.payment_status}</td>
                            <td>{formatKes(order.total_kes)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
        {message && (
          <p className="mt-6 text-sm text-navy" role="status">
            {message}
          </p>
        )}
        {loading && isSupabaseConfigured && (
          <p className="mt-6 text-sm text-muted-foreground">Loading secure dashboard…</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
