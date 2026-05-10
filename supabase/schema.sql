create extension if not exists "pgcrypto";

create type public.pack_type as enum ('unit', 'ten', 'hundred');
create type public.transaction_status as enum ('stock', 'selling', 'sold', 'unsold');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_-]{3,24}$'),
  created_at timestamptz not null default now()
);

create or replace function public.normalize_username(candidate text)
returns text
language sql
immutable
as $$
  select lower(trim(candidate));
$$;

create or replace function public.is_username_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.normalize_username(candidate) ~ '^[a-z0-9_-]{3,24}$', false)
    and not exists (
      select 1
      from public.profiles
      where username = public.normalize_username(candidate)
    );
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_username text;
begin
  requested_username := public.normalize_username(new.raw_user_meta_data ->> 'username');

  if requested_username is null or requested_username !~ '^[a-z0-9_-]{3,24}$' then
    raise exception 'Invalid username';
  end if;

  insert into public.profiles (id, username)
  values (new.id, requested_username);

  return new;
end;
$$;

create trigger create_profile_after_auth_user_insert
after insert on auth.users
for each row
execute function public.create_profile_for_new_user();

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id integer,
  item_name text not null,
  item_icon_url text,
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

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can delete their own profile"
on public.profiles
for delete
to authenticated
using (id = auth.uid());

create policy "Users can read their own transactions"
on public.transactions
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert their own transactions"
on public.transactions
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own transactions"
on public.transactions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own transactions"
on public.transactions
for delete
to authenticated
using (user_id = auth.uid());
