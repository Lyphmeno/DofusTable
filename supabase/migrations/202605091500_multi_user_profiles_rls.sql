create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_-]{3,24}$'),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

alter table public.transactions
add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists transactions_user_id_created_at_idx
  on public.transactions (user_id, created_at desc);

do $$
begin
  if not exists (
    select 1
    from public.transactions
    where user_id is null
  ) then
    alter table public.transactions
    alter column user_id set not null;
  end if;
end;
$$;

do $$
begin
  if to_regclass('public.allowed_users') is not null then
    execute 'drop policy if exists "Allowed users can read themselves" on public.allowed_users';
  end if;
end;
$$;

drop policy if exists "Only allowed authenticated users can read transactions" on public.transactions;
drop policy if exists "Only allowed authenticated users can insert transactions" on public.transactions;
drop policy if exists "Only allowed authenticated users can update transactions" on public.transactions;
drop policy if exists "Only allowed authenticated users can delete transactions" on public.transactions;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;

drop policy if exists "Users can read their own transactions" on public.transactions;
drop policy if exists "Users can insert their own transactions" on public.transactions;
drop policy if exists "Users can update their own transactions" on public.transactions;
drop policy if exists "Users can delete their own transactions" on public.transactions;

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

-- If an existing database has legacy transactions with user_id = null,
-- attach them manually to the current owner before enforcing NOT NULL:
-- update public.transactions set user_id = '<auth-user-uuid>' where user_id is null;
-- alter table public.transactions alter column user_id set not null;
