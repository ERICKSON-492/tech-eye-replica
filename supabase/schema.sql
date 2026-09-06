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
