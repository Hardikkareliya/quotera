-- Early access waitlist (public insert only; no public read)

create table public.early_access_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  business_type text not null,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'approved', 'rejected')
  ),
  source text not null default 'landing',
  created_at timestamptz not null default now()
);

create unique index early_access_leads_email_lower_idx
  on public.early_access_leads (lower(email));

alter table public.early_access_leads enable row level security;

create policy "Public can submit early access leads"
  on public.early_access_leads
  for insert
  to anon, authenticated
  with check (true);
