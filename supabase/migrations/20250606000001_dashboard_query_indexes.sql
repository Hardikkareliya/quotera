-- Speed up dashboard analytics filters by org + date
create index if not exists payments_org_paid_at_idx
  on public.payments (org_id, paid_at desc);

create index if not exists invoices_org_issue_date_idx
  on public.invoices (org_id, issue_date desc);

create index if not exists quotations_org_issue_date_idx
  on public.quotations (org_id, issue_date desc);

create index if not exists invoices_org_status_idx
  on public.invoices (org_id, status);
