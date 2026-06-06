-- Per-field toggles for what appears on quotation & invoice PDFs

alter table public.organizations
  add column if not exists document_visibility jsonb not null default '{
    "address": true,
    "state": true,
    "email": true,
    "phone": true,
    "website": true,
    "gstin": true,
    "pan": true,
    "logo": true,
    "bank": true,
    "signature": true,
    "payment_qr": true
  }'::jsonb;
