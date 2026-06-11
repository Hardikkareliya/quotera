-- Extra early access lead fields (workflow, needs, budget)

alter table public.early_access_leads
  add column if not exists business_type_other text,
  add column if not exists current_workflow text,
  add column if not exists needs_notes text,
  add column if not exists monthly_budget text;
