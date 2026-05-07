alter type public.transaction_status add value if not exists 'unsold';

alter table public.transactions
add column if not exists listing_tax numeric(14, 2) not null default 0 check (listing_tax >= 0);

alter table public.transactions
alter column status set default 'selling';

update public.transactions
set status = 'selling'
where status = 'stock';
