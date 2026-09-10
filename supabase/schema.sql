create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  sku text not null unique,
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null default '',
  price_kes integer not null default 0 check (price_kes >= 0),
  image_url text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_location text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  payment_reference text,
  subtotal_kes integer not null default 0 check (subtotal_kes >= 0),
  total_kes integer not null default 0 check (total_kes >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_kes integer not null check (unit_price_kes >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Public can view active products" on public.products
  for select using (active = true or public.is_admin());

create policy "Admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Customers view own orders" on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());

create policy "Customers create orders" on public.orders
  for insert with check (customer_id = auth.uid() or customer_id is null);

create policy "Admins manage orders" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Customers view own order items" on public.order_items
  for select using (
    public.is_admin() or exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );

create policy "Customers create order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and (orders.customer_id = auth.uid() or orders.customer_id is null)
    )
  );

create policy "Admins manage order items" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null default 'Guides',
  image_url text,
  image_alt text not null default '',
  read_time text not null default '5 min read',
  body jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc);

alter table public.blog_posts enable row level security;

create policy "Public can view published blog posts" on public.blog_posts
  for select using (published = true or public.is_admin());

create policy "Admins manage blog posts" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());


-- Server-side checkout: re-reads product prices and stock instead of trusting the browser cart.
create or replace function public.create_order_with_items(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_location text,
  p_items jsonb,
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_customer_id uuid := auth.uid();
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_subtotal integer := 0;
  v_line_total integer;
begin
  if coalesce(trim(p_customer_name), '') = ''
    or coalesce(trim(p_customer_email), '') = ''
    or coalesce(trim(p_customer_phone), '') = ''
    or coalesce(trim(p_delivery_location), '') = '' then
    raise exception 'Customer details are required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one order item is required';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity < 1 then
      raise exception 'Order quantities must be positive';
    end if;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
      and active = true
    for update;

    if not found then
      raise exception 'One or more products are no longer available';
    end if;

    if v_product.stock_quantity < v_quantity then
      raise exception 'Insufficient stock for product: %', v_product.name;
    end if;

    v_line_total := v_product.price_kes * v_quantity;
    v_subtotal := v_subtotal + v_line_total;
  end loop;

  insert into public.orders (
    customer_id,
    customer_name,
    customer_email,
    customer_phone,
    delivery_location,
    subtotal_kes,
    total_kes,
    notes
  ) values (
    v_customer_id,
    trim(p_customer_name),
    trim(p_customer_email),
    trim(p_customer_phone),
    trim(p_delivery_location),
    v_subtotal,
    v_subtotal,
    nullif(trim(p_notes), '')
  ) returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid;

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price_kes,
      quantity
    ) values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.price_kes,
      v_quantity
    );

    update public.products
    set stock_quantity = stock_quantity - v_quantity,
        updated_at = now()
    where id = v_product.id;
  end loop;

  return v_order_id;
end;
$$;

grant execute on function public.create_order_with_items(text, text, text, text, jsonb, text)
to anon, authenticated;


-- Public product images with admin-only uploads and management.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());


-- Quotation portal: public requests and admin-managed quote details.
create table if not exists public.quotation_requests (
  id uuid primary key default uuid_generate_v4(),
  quote_number text not null unique default ('QT-' || to_char(now(), 'YYYYMMDDHH24MISSMS')),
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  service text,
  project_location text,
  project_type text,
  timeline text,
  details text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'quoted', 'sent', 'approved', 'declined', 'closed')),
  admin_notes text not null default '',
  subtotal_kes integer not null default 0 check (subtotal_kes >= 0),
  total_kes integer not null default 0 check (total_kes >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotation_items (
  id uuid primary key default uuid_generate_v4(),
  quotation_id uuid not null references public.quotation_requests(id) on delete cascade,
  description text not null,
  model text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_kes integer not null default 0 check (unit_price_kes >= 0),
  created_at timestamptz not null default now()
);

alter table public.quotation_requests drop column if exists discount_kes;

create index if not exists quotation_requests_status_idx
  on public.quotation_requests (status, created_at desc);

alter table public.quotation_requests enable row level security;
alter table public.quotation_items enable row level security;

drop policy if exists "Public can submit quotation requests" on public.quotation_requests;
create policy "Public can submit quotation requests"
on public.quotation_requests for insert
with check (customer_id = auth.uid() or customer_id is null);

drop policy if exists "Customers view own quotations" on public.quotation_requests;
create policy "Customers view own quotations"
on public.quotation_requests for select
using (customer_id = auth.uid() or public.is_admin());

drop policy if exists "Admins manage quotations" on public.quotation_requests;
create policy "Admins manage quotations"
on public.quotation_requests for all
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers view own quotation items" on public.quotation_items;
create policy "Customers view own quotation items"
on public.quotation_items for select
using (
  public.is_admin() or exists (
    select 1 from public.quotation_requests
    where quotation_requests.id = quotation_items.quotation_id
      and quotation_requests.customer_id = auth.uid()
  )
);

drop policy if exists "Admins manage quotation items" on public.quotation_items;
create policy "Admins manage quotation items"
on public.quotation_items for all
using (public.is_admin()) with check (public.is_admin());
