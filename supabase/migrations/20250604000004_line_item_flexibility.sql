-- Flexible line items: fixed amount vs qty×rate, sub-description, per-line GST

alter table public.quotation_items
  add column if not exists sub_description text,
  add column if not exists pricing_mode text not null default 'qty_rate'
    check (pricing_mode in ('qty_rate', 'fixed'));

alter table public.invoice_items
  add column if not exists sub_description text,
  add column if not exists pricing_mode text not null default 'qty_rate'
    check (pricing_mode in ('qty_rate', 'fixed'));
