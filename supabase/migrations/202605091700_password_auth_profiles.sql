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

drop trigger if exists create_profile_after_auth_user_insert on auth.users;

create trigger create_profile_after_auth_user_insert
after insert on auth.users
for each row
execute function public.create_profile_for_new_user();
