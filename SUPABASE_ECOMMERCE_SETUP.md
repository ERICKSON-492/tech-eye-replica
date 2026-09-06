# Supabase Ecommerce and Admin Setup

This repository now contains a Supabase-ready Shop, cart, checkout-ready request flow, and authenticated admin dashboard foundation. Live authentication, database persistence, inventory, order management, and payment processing remain disabled until the Supabase project and payment provider are connected.

## 1. Configure browser-safe environment variables

Copy `.env.example` to the deployment environment and set:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The anonymous key is designed for browser use when Row Level Security is correctly enabled. Never expose a Supabase service-role key in `VITE_*` variables or client-side code.

## 2. Create the database schema

Open the Supabase SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql). It creates `profiles`, `products`, `orders`, and `order_items`, enables Row Level Security, adds the admin-role function, and creates the new-user profile trigger.

The public catalog can read active products. Customers can create orders and view only their own order records. Admins are identified by `profiles.role = 'admin'` and can manage products, orders, and order items through RLS-protected operations.

## 3. Create and promote the first admin

Create the first account through Supabase Auth using the email/password provider. Then, after verifying the account owner, run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

The `/admin` route checks the Supabase session and the profile role before querying product or order data. A signed-in customer cannot access admin data through the frontend because the database policies reject non-admin reads and writes.

## 4. Seed products

The Shop page currently uses a small starter catalog from `src/lib/shop.ts` so the UI can be tested before Supabase is connected. Once the database is configured, seed the `products` table with real names, SKUs, prices, stock quantities, descriptions, and image URLs. The production version should replace the starter catalog query with a Supabase `products` query and retain the same `ShopProduct` shape.

The existing images are used as visual banners and starter product imagery. Replace them with approved product or project images when available, preferably using Supabase Storage or another controlled image host.

## 5. Payment provider

The checkout-ready page collects customer details and calculates a cart subtotal, but it does not activate payment capture. Choose a payment provider before production launch, then implement a server-side payment session or payment-intent flow. Do not trust browser-submitted prices: read product prices from Supabase on the server or in a protected edge function, create the order, and confirm payment through the provider webhook before marking `payment_status` as `paid`.

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
