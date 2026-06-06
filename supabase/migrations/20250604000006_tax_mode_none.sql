-- Allow documents without tax (none | gst | igst)
alter table public.quotations
  drop constraint if exists quotations_tax_mode_check;

alter table public.quotations
  add constraint quotations_tax_mode_check
    check (tax_mode in ('none', 'gst', 'igst'));

alter table public.quotations
  alter column tax_mode set default 'none';

alter table public.invoices
  drop constraint if exists invoices_tax_mode_check;

alter table public.invoices
  add constraint invoices_tax_mode_check
    check (tax_mode in ('none', 'gst', 'igst'));

alter table public.invoices
  alter column tax_mode set default 'none';
