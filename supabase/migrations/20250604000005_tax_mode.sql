-- Manual GST vs IGST on quotations and invoices
alter table public.quotations
  add column if not exists tax_mode text not null default 'none'
    check (tax_mode in ('none', 'gst', 'igst'));

alter table public.invoices
  add column if not exists tax_mode text not null default 'none'
    check (tax_mode in ('none', 'gst', 'igst'));
