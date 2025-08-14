-- Schéma minimal Amado Shop (Supabase/Postgres)
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price integer not null default 0,
  category text,
  image_url text,
  description text,
  stock integer default 0,
  sales_count integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  notes text,
  total integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  price integer not null default 0,
  quantity integer not null default 1
);

create table if not exists admins (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  full_name text,
  hashed_password text not null
);

-- Exemple de création d'admin (remplacez le hash):
-- insert into admins (username, full_name, hashed_password) values (
--   'admin', 'Administrateur', '$2y$10$hash_bcrypt_a_mettre_ici'
-- );
