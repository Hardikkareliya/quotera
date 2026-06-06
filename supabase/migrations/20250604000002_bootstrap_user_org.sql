-- Creates org + membership for the logged-in user (bypasses RLS safely via auth.uid() check)

create or replace function public.bootstrap_user_org(_full_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _org_id uuid;
  _name text;
begin
  if _uid is null then
    raise exception 'not authenticated';
  end if;

  select om.org_id into _org_id
  from public.org_members om
  where om.user_id = _uid
  limit 1;

  if _org_id is not null then
    return _org_id;
  end if;

  if _full_name is not null and trim(_full_name) <> '' then
    _name := trim(_full_name) || '''s Business';
  else
    _name := 'My Business';
  end if;

  insert into public.profiles (id, full_name)
  values (_uid, nullif(trim(_full_name), ''))
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = now();

  insert into public.organizations (owner_id, name)
  values (_uid, _name)
  returning id into _org_id;

  insert into public.org_members (org_id, user_id, role)
  values (_org_id, _uid, 'owner');

  return _org_id;
end;
$$;

revoke all on function public.bootstrap_user_org(text) from public;
grant execute on function public.bootstrap_user_org(text) to authenticated;
