alter table public.transactions
add column if not exists item_id integer,
add column if not exists item_icon_url text;
