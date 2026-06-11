-- Quotera MVP schema + RLS + atomic numbering
-- ORDER: tables → indexes → functions → RLS → storage

-- ---------------------------------------------------------------------------
-- Tables (must exist before is_org_member references org_members)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete restrict,
  name text not null default 'My Business',
  gstin text,
  address text,
  state_code text not null default '24',
  logo_url text,
  signature_url text,
  payment_qr_url text,
  default_currency text not null default 'INR',
  invoice_prefix text not null default 'INV-',
  quote_prefix text not null default 'QT-',
  next_invoice_number int not null default 1,
  next_quote_number int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.org_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  billing_address text,
  gstin text,
  state_code text not null default '24',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  number text not null,
  status text not null default 'draft' check (
    status in ('draft', 'sent', 'accepted', 'rejected', 'expired')
  ),
  issue_date date not null default current_date,
  valid_until date,
  subtotal numeric(14, 2) not null default 0,
  tax_total numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  tax_mode text not null default 'none' check (tax_mode in ('none', 'gst', 'igst')),
  currency text not null default 'INR',
  notes text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, number)
);

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations (id) on delete cascade,
  description text not null,
  sub_description text,
  pricing_mode text not null default 'qty_rate'
    check (pricing_mode in ('qty_rate', 'fixed')),
  hsn_sac text,
  qty numeric(14, 4) not null default 1,
  unit_price numeric(14, 2) not null default 0,
  tax_rate numeric(5, 2) not null default 0,
  line_total numeric(14, 2) not null default 0,
  sort_order int not null default 0
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  quotation_id uuid references public.quotations (id) on delete set null,
  number text not null,
  status text not null default 'draft' check (
    status in ('draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled')
  ),
  issue_date date not null default current_date,
  due_date date,
  subtotal numeric(14, 2) not null default 0,
  tax_total numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  tax_mode text not null default 'gst' check (tax_mode in ('gst', 'igst')),
  amount_paid numeric(14, 2) not null default 0,
  currency text not null default 'INR',
  place_of_supply text not null,
  notes text,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, number)
);

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  sub_description text,
  pricing_mode text not null default 'qty_rate'
    check (pricing_mode in ('qty_rate', 'fixed')),
  hsn_sac text,
  qty numeric(14, 4) not null default 1,
  unit_price numeric(14, 2) not null default 0,
  tax_rate numeric(5, 2) not null default 0,
  line_total numeric(14, 2) not null default 0,
  sort_order int not null default 0
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  method text not null default 'other' check (
    method in ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'other')
  ),
  paid_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index clients_org_id_idx on public.clients (org_id);
create index quotations_org_id_idx on public.quotations (org_id);
create index invoices_org_id_idx on public.invoices (org_id);
create index payments_org_id_idx on public.payments (org_id);
create index payments_invoice_id_idx on public.payments (invoice_id);

-- ---------------------------------------------------------------------------
-- Helper: org membership (AFTER org_members table exists)
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.org_members
    where org_id = _org_id and user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Atomic document numbering
-- ---------------------------------------------------------------------------
create or replace function public.next_quote_number(_org_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _n int;
  _prefix text;
begin
  update public.organizations
  set next_quote_number = next_quote_number + 1
  where id = _org_id and public.is_org_member(_org_id)
  returning next_quote_number - 1, quote_prefix into _n, _prefix;

  if _n is null then
    raise exception 'not authorized';
  end if;

  return _prefix || lpad(_n::text, 4, '0');
end;
$$;

create or replace function public.next_invoice_number(_org_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _n int;
  _prefix text;
begin
  update public.organizations
  set next_invoice_number = next_invoice_number + 1
  where id = _org_id and public.is_org_member(_org_id)
  returning next_invoice_number - 1, invoice_prefix into _n, _prefix;

  if _n is null then
    raise exception 'not authorized';
  end if;

  return _prefix || lpad(_n::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.clients enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;

-- profiles
create policy "users read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "users insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "users update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- org_members (avoid recursion into organizations)
create policy "users read own memberships"
  on public.org_members for select
  using (user_id = auth.uid());

create policy "users insert own membership"
  on public.org_members for insert
  with check (user_id = auth.uid());

-- organizations
create policy "members read org"
  on public.organizations for select
  using (public.is_org_member(id));

create policy "owner insert org"
  on public.organizations for insert
  with check (owner_id = auth.uid());

create policy "members update org"
  on public.organizations for update
  using (public.is_org_member(id));

-- clients
create policy "members read clients"
  on public.clients for select using (public.is_org_member(org_id));
create policy "members insert clients"
  on public.clients for insert with check (public.is_org_member(org_id));
create policy "members update clients"
  on public.clients for update using (public.is_org_member(org_id));
create policy "members delete clients"
  on public.clients for delete using (public.is_org_member(org_id));

-- quotations
create policy "members read quotations"
  on public.quotations for select using (public.is_org_member(org_id));
create policy "members insert quotations"
  on public.quotations for insert with check (public.is_org_member(org_id));
create policy "members update quotations"
  on public.quotations for update using (public.is_org_member(org_id));
create policy "members delete quotations"
  on public.quotations for delete using (public.is_org_member(org_id));

-- quotation_items (via quotation org)
create policy "members read quotation_items"
  on public.quotation_items for select
  using (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id and public.is_org_member(q.org_id)
    )
  );
create policy "members insert quotation_items"
  on public.quotation_items for insert
  with check (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id and public.is_org_member(q.org_id)
    )
  );
create policy "members update quotation_items"
  on public.quotation_items for update
  using (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id and public.is_org_member(q.org_id)
    )
  );
create policy "members delete quotation_items"
  on public.quotation_items for delete
  using (
    exists (
      select 1 from public.quotations q
      where q.id = quotation_id and public.is_org_member(q.org_id)
    )
  );

-- invoices
create policy "members read invoices"
  on public.invoices for select using (public.is_org_member(org_id));
create policy "members insert invoices"
  on public.invoices for insert with check (public.is_org_member(org_id));
create policy "members update invoices"
  on public.invoices for update using (public.is_org_member(org_id));
create policy "members delete invoices"
  on public.invoices for delete using (public.is_org_member(org_id));

-- invoice_items
create policy "members read invoice_items"
  on public.invoice_items for select
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.is_org_member(i.org_id)
    )
  );
create policy "members insert invoice_items"
  on public.invoice_items for insert
  with check (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.is_org_member(i.org_id)
    )
  );
create policy "members update invoice_items"
  on public.invoice_items for update
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.is_org_member(i.org_id)
    )
  );
create policy "members delete invoice_items"
  on public.invoice_items for delete
  using (
    exists (
      select 1 from public.invoices i
      where i.id = invoice_id and public.is_org_member(i.org_id)
    )
  );

-- payments
create policy "members read payments"
  on public.payments for select using (public.is_org_member(org_id));
create policy "members insert payments"
  on public.payments for insert with check (public.is_org_member(org_id));
create policy "members update payments"
  on public.payments for update using (public.is_org_member(org_id));
create policy "members delete payments"
  on public.payments for delete using (public.is_org_member(org_id));

-- ---------------------------------------------------------------------------
-- Storage bucket for org branding assets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('org-assets', 'org-assets', true)
on conflict (id) do nothing;

create policy "members read org assets"
  on storage.objects for select
  using (
    bucket_id = 'org-assets'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "members upload org assets"
  on storage.objects for insert
  with check (
    bucket_id = 'org-assets'
    and auth.uid() is not null
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "members update org assets"
  on storage.objects for update
  using (
    bucket_id = 'org-assets'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy "members delete org assets"
  on storage.objects for delete
  using (
    bucket_id = 'org-assets'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );
