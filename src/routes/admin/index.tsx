import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Footer, Header, TopBar } from "@/components/site-chrome";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { formatKes } from "@/lib/shop";
import { QuotationBuilder, type QuotationSavePayload } from "@/components/quotation-builder";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Eyetech Stainless Steel Expert" },
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
  image_url: string | null;
};
type OrderRow = {
  id: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total_kes: number;
  created_at: string;
};
type QuotationRow = {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service: string | null;
  project_location: string | null;
  project_type: string | null;
  timeline: string | null;
  details: string;
  status: string;
  admin_notes: string;
  subtotal_kes: number;
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
type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string | null;
  image_alt: string;
  read_time: string;
  body: { heading: string; paragraphs: string[] }[];
  published: boolean;
  published_at: string | null;
};
type BlogDraft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  image_alt: string;
  read_time: string;
  body: string;
  published: boolean;
};
const emptyBlogDraft: BlogDraft = {
  slug: "",
  title: "",
  excerpt: "",
  category: "Guides",
  image_url: "/images/workshop.jpg",
  image_alt: "",
  read_time: "5 min read",
  body: "",
  published: false,
};

function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [showNewQuotation, setShowNewQuotation] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogRow[]>([]);
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(emptyBlogDraft);
  const [liveStatus, setLiveStatus] = useState<"connecting" | "live">("connecting");
  const [liveCount, setLiveCount] = useState(0);
  const [lastLiveAt, setLastLiveAt] = useState<Date | null>(null);
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
    const [
      { data: productRows },
      { data: orderRows },
      { data: quotationRows },
      { data: blogRows },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("id, sku, name, category, price_kes, stock_quantity, active")
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id, customer_name, status, payment_status, total_kes, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("quotation_requests")
        .select(
          "id, quote_number, customer_name, customer_email, customer_phone, service, project_location, project_type, timeline, details, status, admin_notes, subtotal_kes, total_kes, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("blog_posts")
        .select(
          "id, slug, title, excerpt, category, image_url, image_alt, read_time, body, published, published_at",
        )
        .order("updated_at", { ascending: false }),
    ]);
    setProducts((productRows ?? []) as ProductRow[]);
    setOrders((orderRows ?? []) as OrderRow[]);
    const nextQuotations = (quotationRows ?? []) as QuotationRow[];
    setQuotations(nextQuotations);
    setSelectedQuotationId((current) => current ?? nextQuotations[0]?.id ?? null);
    setBlogPosts((blogRows ?? []) as BlogRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || role !== "admin") return;
    const channel = supabase
      .channel("quotation-requests-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quotation_requests" },
        (payload) => {
          const row = payload.new as QuotationRow | undefined;
          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id?: string } | undefined)?.id;
            if (oldId) setQuotations((current) => current.filter((item) => item.id !== oldId));
            return;
          }
          if (!row?.id) return;
          setQuotations((current) => {
            const rest = current.filter((item) => item.id !== row.id);
            return [row, ...rest];
          });
          if (payload.eventType === "INSERT") {
            setLiveCount((count) => count + 1);
            setLastLiveAt(new Date());
          }
        },
      )
      .subscribe((status) => setLiveStatus(status === "SUBSCRIBED" ? "live" : "connecting"));

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [role]);

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
    setQuotations([]);
    setSelectedQuotationId(null);
    setBlogPosts([]);
    setBlogDraft(emptyBlogDraft);
  };

  const saveBuilderQuotation = async (payload: QuotationSavePayload) => {
    const { data: quotation, error } = await supabase
      .from("quotation_requests")
      .insert({
        customer_name: payload.attn.trim() || "Customer quotation",
        customer_email: "",
        customer_phone: "",
        service: payload.company || null,
        project_location: payload.location || null,
        project_type: null,
        timeline: null,
        details: payload.notes || "Quotation created by admin.",
        status: "quoted",
        admin_notes: `Quote no. ${payload.quoteNumber}, dated ${payload.date}.`,
        subtotal_kes: Math.round(payload.subtotal),
        total_kes: Math.round(payload.total),
      })
      .select("id")
      .single();
    if (error || !quotation) {
      return { error: error?.message ?? "Quotation could not be created." };
    }
    const validItems = payload.items.filter((item) => item.description.trim());
    if (validItems.length) {
      const { error: itemsError } = await supabase.from("quotation_items").insert(
        validItems.map((item) => ({
          quotation_id: quotation.id,
          description: item.description,
          model: item.model,
          quantity: item.quantity,
          unit_price_kes: Math.round(item.unitPrice),
        })),
      );
      if (itemsError) return { error: itemsError.message };
    }
    setShowNewQuotation(false);
    void loadDashboard();
    return undefined;
  };

  const updateQuotation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedQuotationId) return;
    const form = new FormData(event.currentTarget);
    const subtotal = Number(form.get("subtotal_kes")) || 0;
    const total = subtotal;
    const { error } = await supabase
      .from("quotation_requests")
      .update({
        status: String(form.get("status")),
        admin_notes: String(form.get("admin_notes") || ""),
        subtotal_kes: subtotal,
        total_kes: total,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedQuotationId);
    setMessage(error ? error.message : "Quotation updated.");
    if (!error) void loadDashboard();
  };

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    const imageFile = image instanceof File && image.size > 0 ? image : null;
    let imageUrl: string | null = null;
    let uploadedPath: string | null = null;

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        setMessage("Please choose an image file.");
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setMessage("Product images must be 5 MB or smaller.");
        return;
      }

      const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      uploadedPath = `${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("product-images").upload(uploadedPath, imageFile, {
        cacheControl: "3600",
        contentType: imageFile.type,
        upsert: false,
      });
      if (upload.error) {
        setMessage(`Image upload failed: ${upload.error.message}`);
        return;
      }
      imageUrl = supabase.storage.from("product-images").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const { error } = await supabase.from("products").insert({
      sku: String(form.get("sku")),
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      category: String(form.get("category")),
      description: String(form.get("description")),
      price_kes: Number(form.get("price_kes")),
      stock_quantity: Number(form.get("stock_quantity")),
      image_url: imageUrl,
      active: true,
    });

    if (error && uploadedPath) {
      await supabase.storage.from("product-images").remove([uploadedPath]);
    }
    setMessage(error ? error.message : "Product created.");
    if (!error) {
      event.currentTarget.reset();
      void loadDashboard();
    }
  };

  const saveBlogPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    const imageFile = image instanceof File && image.size > 0 ? image : null;
    let imageUrl = blogDraft.image_url.trim() || "/images/workshop.jpg";
    let uploadedPath: string | null = null;

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        setMessage("Please choose an image file.");
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setMessage("Blog images must be 5 MB or smaller.");
        return;
      }

      const extension = imageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      uploadedPath = `${crypto.randomUUID()}.${extension}`;
      const upload = await supabase.storage.from("blog-images").upload(uploadedPath, imageFile, {
        cacheControl: "3600",
        contentType: imageFile.type,
        upsert: false,
      });
      if (upload.error) {
        setMessage(`Image upload failed: ${upload.error.message}`);
        return;
      }
      imageUrl = supabase.storage.from("blog-images").getPublicUrl(uploadedPath).data.publicUrl;
    }

    const paragraphs = blogDraft.body
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const payload = {
      slug: blogDraft.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: blogDraft.title.trim(),
      excerpt: blogDraft.excerpt.trim(),
      category: blogDraft.category.trim() || "Guides",
      image_url: imageUrl,
      image_alt: blogDraft.image_alt.trim() || blogDraft.title.trim(),
      read_time: blogDraft.read_time.trim() || "5 min read",
      body: [{ heading: "Article", paragraphs }],
      published: blogDraft.published,
      published_at: blogDraft.published ? new Date().toISOString() : null,
    };
    const result = blogDraft.id
      ? await supabase.from("blog_posts").update(payload).eq("id", blogDraft.id)
      : await supabase.from("blog_posts").insert(payload);
    if (result.error && uploadedPath) {
      await supabase.storage.from("blog-images").remove([uploadedPath]);
    }
    setMessage(
      result.error
        ? result.error.message
        : blogDraft.id
          ? "Blog post updated."
          : "Blog post created.",
    );
    if (!result.error) {
      setBlogDraft(emptyBlogDraft);
      event.currentTarget.reset();
      void loadDashboard();
    }
  };

  const editBlogPost = (post: BlogRow) => {
    setBlogDraft({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      image_url: post.image_url ?? "/images/workshop.jpg",
      image_alt: post.image_alt,
      read_time: post.read_time,
      body: post.body.flatMap((section) => section.paragraphs).join("\n\n"),
      published: post.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleBlogPublish = async (post: BlogRow) => {
    const nextPublished = !post.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: nextPublished,
        published_at: nextPublished ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    setMessage(
      error ? error.message : nextPublished ? "Blog post published." : "Blog post unpublished.",
    );
    if (!error) void loadDashboard();
  };

  const deleteBlogPost = async (post: BlogRow) => {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    setMessage(error ? error.message : "Blog post deleted.");
    if (!error) void loadDashboard();
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
            <div className="flex flex-wrap gap-2">
              <Link
                to="/quotation-builder"
                target="_blank"
                className="inline-flex min-h-11 items-center border border-gold bg-gold px-4 text-xs font-bold uppercase tracking-widest text-navy-deep"
              >
                Open quotation builder ↗
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="min-h-11 border border-border px-4 text-xs font-bold uppercase tracking-widest text-navy"
              >
                Sign out
              </button>
            </div>
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
                    Product image (optional)
                    <input
                      name="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="border border-border bg-background px-3 py-2.5 text-sm font-normal normal-case tracking-normal"
                    />
                    <span className="text-[11px] font-normal normal-case tracking-normal text-muted-foreground">
                      Upload a JPG, PNG or WebP image up to 5 MB. The file is stored in Supabase
                      Storage.
                    </span>
                  </label>
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
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt=""
                                  className="mb-2 h-12 w-16 rounded object-cover"
                                  loading="lazy"
                                />
                              ) : null}
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
            <section className="border border-border bg-white p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    Lead management
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-navy">Quotation requests</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Review public requests, price a scope, update the workflow status and print a
                    quote-ready summary.
                  </p>
                  <p
                    aria-live="polite"
                    className="mt-3 inline-flex items-center gap-2 border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-navy"
                  >
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${liveStatus === "live" ? "animate-pulse bg-green-600" : "bg-muted-foreground"}`}
                      aria-hidden="true"
                    />
                    {liveStatus === "live" ? "Live" : "Connecting…"}
                    {liveCount > 0 && (
                      <span className="text-gold">
                        {liveCount} new
                        {lastLiveAt ? ` · ${lastLiveAt.toLocaleTimeString()}` : ""}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewQuotation((open) => !open)}
                  className="min-h-11 bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-navy-deep"
                >
                  {showNewQuotation ? "Close builder" : "New quotation"}
                </button>
              </div>
              {showNewQuotation && (
                <div className="mt-6 border border-gold/60 bg-gold/5 p-5">
                  <QuotationBuilder onSave={saveBuilderQuotation} embedded />
                </div>
              )}
              {quotations.length === 0 ? (
                <p className="mt-6 border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No quotation requests yet. New submissions from the public contact and service
                  forms will appear here.
                </p>
              ) : (
                <div className="mt-6 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
                  <div className="space-y-2">
                    {quotations.map((quotation) => (
                      <button
                        key={quotation.id}
                        type="button"
                        onClick={() => setSelectedQuotationId(quotation.id)}
                        className={`w-full border p-4 text-left transition-colors ${selectedQuotationId === quotation.id ? "border-gold bg-gold/10" : "border-border bg-background hover:border-gold"}`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-navy">{quotation.quote_number}</strong>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                            {quotation.status}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm font-bold text-navy">
                          {quotation.customer_name}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {quotation.service || "General enquiry"} ·{" "}
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                  {(() => {
                    const quotation =
                      quotations.find((item) => item.id === selectedQuotationId) ?? quotations[0];
                    if (!quotation) return null;
                    return (
                      <div key={quotation.id} className="border border-border bg-background p-5">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gold">
                              Quotation {quotation.quote_number}
                            </p>
                            <h3 className="mt-2 text-2xl font-black text-navy">
                              {quotation.customer_name}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {quotation.customer_phone}
                              {quotation.customer_email ? ` · ${quotation.customer_email}` : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="min-h-10 border border-navy px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy"
                          >
                            Print / Save PDF
                          </button>
                        </div>
                        <dl className="mt-6 grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-widest text-gold">
                              Service
                            </dt>
                            <dd className="mt-1 text-navy">{quotation.service || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-widest text-gold">
                              Location
                            </dt>
                            <dd className="mt-1 text-navy">{quotation.project_location || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-widest text-gold">
                              Project type
                            </dt>
                            <dd className="mt-1 text-navy">{quotation.project_type || "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-widest text-gold">
                              Timeline
                            </dt>
                            <dd className="mt-1 text-navy">{quotation.timeline || "—"}</dd>
                          </div>
                        </dl>
                        <div className="mt-5 border-l-2 border-gold bg-white p-4 text-sm leading-relaxed text-navy">
                          {quotation.details}
                        </div>
                        <form onSubmit={updateQuotation} className="mt-6 grid gap-4 sm:grid-cols-2">
                          <label className="grid gap-2 text-sm font-bold text-navy">
                            Status
                            <select
                              name="status"
                              defaultValue={quotation.status}
                              className="border border-border bg-white px-3 py-2.5 font-normal"
                            >
                              {[
                                "new",
                                "reviewing",
                                "quoted",
                                "sent",
                                "approved",
                                "declined",
                                "closed",
                              ].map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="grid gap-2 text-sm font-bold text-navy">
                            Subtotal (KES)
                            <input
                              name="subtotal_kes"
                              type="number"
                              min="0"
                              defaultValue={quotation.subtotal_kes}
                              className="border border-border bg-white px-3 py-2.5 font-normal"
                            />
                          </label>
                          <div className="flex items-end border border-navy bg-navy p-3 text-white">
                            <span>
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gold">
                                Current total
                              </span>
                              <strong className="mt-1 block text-xl">
                                {formatKes(quotation.total_kes)}
                              </strong>
                            </span>
                          </div>
                          <label className="grid gap-2 text-sm font-bold text-navy sm:col-span-2">
                            Admin notes
                            <textarea
                              name="admin_notes"
                              rows={3}
                              defaultValue={quotation.admin_notes}
                              placeholder="Add scope, exclusions, payment terms or follow-up notes"
                              className="border border-border bg-white px-3 py-2.5 font-normal"
                            />
                          </label>
                          <button
                            type="submit"
                            className="min-h-11 bg-gold px-5 py-3 text-sm font-bold text-navy-deep sm:col-span-2"
                          >
                            Save quotation update
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </div>
              )}
            </section>
            <section className="border border-border bg-white p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    Content management
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-navy">Blog posts</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Draft, edit and publish articles that appear on the public Blog page.
                  </p>
                </div>
                {blogDraft.id && (
                  <button
                    type="button"
                    onClick={() => setBlogDraft(emptyBlogDraft)}
                    className="min-h-11 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-navy"
                  >
                    New post
                  </button>
                )}
              </div>
              <form onSubmit={saveBlogPost} className="mt-6 grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Title
                  <input
                    required
                    value={blogDraft.title}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, title: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Slug
                  <input
                    required
                    value={blogDraft.slug}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, slug: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Category
                  <input
                    required
                    value={blogDraft.category}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, category: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Read time
                  <input
                    required
                    value={blogDraft.read_time}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, read_time: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy lg:col-span-2">
                  Excerpt
                  <textarea
                    required
                    rows={3}
                    value={blogDraft.excerpt}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, excerpt: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Image
                  <div className="flex flex-wrap items-center gap-3">
                    {blogDraft.image_url && (
                      <img
                        src={blogDraft.image_url}
                        alt=""
                        className="h-14 w-20 border border-border object-cover"
                      />
                    )}
                    <input
                      type="file"
                      name="image"
                      accept="image/jpeg,image/png,image/webp"
                      className="border border-border bg-background px-4 py-3 font-normal"
                    />
                  </div>
                  <p className="text-xs font-normal text-muted-foreground">
                    Upload a JPG, PNG or WebP image up to 5 MB.
                    {blogDraft.id ? " Leave blank to keep the current image." : ""}
                  </p>
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy">
                  Image alt text
                  <input
                    required
                    value={blogDraft.image_alt}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, image_alt: event.target.value }))
                    }
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-navy lg:col-span-2">
                  Article body
                  <textarea
                    required
                    rows={8}
                    value={blogDraft.body}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, body: event.target.value }))
                    }
                    placeholder="Use a blank line between paragraphs."
                    className="border border-border bg-background px-4 py-3 font-normal"
                  />
                </label>
                <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={blogDraft.published}
                    onChange={(event) =>
                      setBlogDraft((draft) => ({ ...draft, published: event.target.checked }))
                    }
                    className="h-5 w-5 accent-gold"
                  />
                  Publish immediately
                </label>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="min-h-11 bg-gold px-5 py-3 text-sm font-bold text-navy-deep"
                  >
                    {blogDraft.id ? "Save changes" : "Create post"}
                  </button>
                </div>
              </form>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                      <th className="py-3">Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="border-b border-border">
                        <td className="py-3 font-bold text-navy">{post.title}</td>
                        <td>{post.category}</td>
                        <td>{post.published ? "Published" : "Draft"}</td>
                        <td>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => editBlogPost(post)}
                              className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void toggleBlogPublish(post)}
                              className="min-h-10 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-navy"
                            >
                              {post.published ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteBlogPost(post)}
                              className="min-h-10 border border-red-200 px-3 py-2 text-xs font-bold uppercase tracking-widest text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
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
