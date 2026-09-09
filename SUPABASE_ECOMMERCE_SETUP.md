# Supabase Ecommerce and Admin Setup

This repository now contains a Supabase-backed Shop, persistent cart, server-validated order request flow, and authenticated admin dashboard foundation. Live payment capture still requires a payment provider and server-side webhook configuration.

## 1. Configure browser-safe environment variables

Copy `.env.example` to the deployment environment and set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The anonymous key is designed for browser use when Row Level Security is correctly enabled. Never expose a Supabase service-role key in `VITE_*` variables or client-side code.

## 2. Create the database schema

Open the Supabase SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql). It creates `profiles`, `products`, `orders`, and `order_items`, enables Row Level Security, adds the admin-role function, and creates the new-user profile trigger.

The public catalog reads active products from Supabase when the environment variables are configured, with the verified starter catalog as a local fallback. Checkout calls the server-side `public.create_order_with_items(...)` RPC, which re-reads active product prices and stock before creating the order and order items. Customers can view only their own order records. Admins are identified by `profiles.role = 'admin'` and can manage products, orders, and order items through RLS-protected operations.

## 3. Create and promote the first admin

Create the first account through Supabase Auth using the email/password provider. Then, after verifying the account owner, run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

The `/admin` route checks the Supabase session and the profile role before querying product or order data. A signed-in customer cannot access admin data through the frontend because the database policies reject non-admin reads and writes.

## 4. Apply checkout function and seed products

If you ran an older version of `supabase/schema.sql`, run the updated file again so the `create_order_with_items` RPC is created. This function is required for checkout submission; the browser does not insert client-supplied prices directly.

The Shop page uses active Supabase `products` rows when configured and falls back to a small verified starter catalog from `src/lib/shop.ts` when Supabase is unavailable. Seed the `products` table with real names, SKUs, prices, stock quantities, descriptions, and image URLs. The checkout RPC validates the active row and stock quantity again before creating an order.

The existing images are used as visual banners and starter product imagery. Replace them with approved product or project images when available, preferably using Supabase Storage or another controlled image host.

## 5. Payment provider

The checkout page now creates a pending order request through the server-side RPC and does not activate payment capture. Choose a payment provider before production launch, then add a server-side payment session or payment-intent flow. Do not trust browser-submitted prices: the RPC re-reads product prices from Supabase, creates the order, and the future provider webhook must confirm payment before `payment_status` is marked as `paid`.

For Kenya-focused checkout, evaluate Paystack, Flutterwave, or M-Pesa/Daraja. Stripe is also supported where the business and settlement setup permit it. Payment secrets must remain server-side and must never be stored in `VITE_*` variables.

## 6. Production checklist

| Area       | Required before launch                                                     |
| ---------- | -------------------------------------------------------------------------- |
| Supabase   | Project URL, anon key, schema applied, Auth provider enabled               |
| Admin      | First verified account promoted to `admin`                                 |
| Catalog    | Real products, prices, stock, images, and SKU values seeded                |
| Checkout   | Payment provider selected and server-side webhook implemented              |
| Security   | RLS tested for anonymous, customer, and admin sessions                     |
| Media      | Product and banner images moved to an approved production storage location |
| Monitoring | Auth, order, payment, and webhook failures logged and alerted              |
| Legal      | Delivery, returns, privacy, terms, and payment notices published           |

## 7. Available routes

The public shop is available at `/shop`, the checkout-ready cart is at `/shop/checkout`, and the protected dashboard foundation is at `/admin`. The public site also includes image-led banners on the Services, About, Contact, and Blog pages.

## 8. Blog content management

The SQL schema also creates `public.blog_posts`. Run the updated `supabase/schema.sql` in the Supabase SQL editor before using blog management. The table stores the slug, title, excerpt, category, image URL, image alt text, read time, JSON article body, publication state, publication timestamp, author reference, and timestamps.

The `/admin` dashboard now includes a Blog posts section for authenticated administrators. Admins can create drafts, edit existing posts, publish or unpublish posts, and delete posts. The public `/blog` and `/blog/:slug` routes query published Supabase posts when the Supabase environment is configured. If Supabase is not configured or has no published rows, the existing local article catalog remains visible as a safe fallback.

Only published posts are readable publicly through Row Level Security. All inserts, updates, and deletes require the `admin` role verified by `public.is_admin()`. Promote the intended Supabase Auth account by updating its row in `public.profiles`:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

The editor currently stores the article body as paragraphs under a single `Article` section. This keeps the public renderer compatible with the existing site while allowing a richer block editor to be added later.
