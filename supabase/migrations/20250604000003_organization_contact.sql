-- Company contact & bank fields for professional quotation/invoice PDFs

alter table public.organizations
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists pan text,
  add column if not exists bank_name text,
  add column if not exists bank_account text,
  add column if not exists bank_ifsc text;
