create extension if not exists "pgcrypto";

create type public.pack_type as enum ('unit', 'ten', 'hundred');
create type public.transaction_status as enum ('stock', 'selling', 'sold', 'unsold');

create table public.allowed_users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  quantity_bought integer not null check (quantity_bought >= 0),
  buy_pack_type public.pack_type not null,
  buy_pack_price numeric(14, 2) not null check (buy_pack_price >= 0),
  sell_pack_type public.pack_type not null,
  sell_pack_price numeric(14, 2) not null check (sell_pack_price >= 0),
  listing_tax numeric(14, 2) not null default 0 check (listing_tax >= 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  status public.transaction_status not null default 'selling',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quantity_sold <= quantity_bought)
);

create index transactions_user_id_created_at_idx
  on public.transactions (user_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger transactions_touch_updated_at
before update on public.transactions
for each row
execute function public.touch_updated_at();

alter table public.allowed_users enable row level security;
alter table public.transactions enable row level security;

create policy "Allowed users can read themselves"
on public.allowed_users
for select
to authenticated
using (email = auth.jwt() ->> 'email');

create policy "Only allowed authenticated users can read transactions"
on public.transactions
for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.allowed_users
    where allowed_users.email = auth.jwt() ->> 'email'
  )
);

create policy "Only allowed authenticated users can insert transactions"
on public.transactions
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.allowed_users
    where allowed_users.email = auth.jwt() ->> 'email'
  )
);

create policy "Only allowed authenticated users can update transactions"
on public.transactions
for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.allowed_users
    where allowed_users.email = auth.jwt() ->> 'email'
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.allowed_users
    where allowed_users.email = auth.jwt() ->> 'email'
  )
);

create policy "Only allowed authenticated users can delete transactions"
on public.transactions
for delete
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.allowed_users
    where allowed_users.email = auth.jwt() ->> 'email'
  )
);

-- Replace this value with your private login email before running the migration.
insert into public.allowed_users (email)
values ('hugolevipro@gmail.com')
on conflict (email) do nothing;
