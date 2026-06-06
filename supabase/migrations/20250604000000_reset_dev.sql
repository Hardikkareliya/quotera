-- DEV ONLY: Run this FIRST if a previous migration attempt left partial objects.
-- Then run 20250604000001_initial_schema.sql

drop policy if exists "members delete org assets" on storage.objects;
drop policy if exists "members update org assets" on storage.objects;
drop policy if exists "members upload org assets" on storage.objects;
drop policy if exists "members read org assets" on storage.objects;

drop function if exists public.next_invoice_number(uuid);
drop function if exists public.next_quote_number(uuid);
drop function if exists public.is_org_member(uuid);

drop table if exists public.payments cascade;
drop table if exists public.invoice_items cascade;
drop table if exists public.invoices cascade;
drop table if exists public.quotation_items cascade;
drop table if exists public.quotations cascade;
drop table if exists public.clients cascade;
drop table if exists public.org_members cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;
