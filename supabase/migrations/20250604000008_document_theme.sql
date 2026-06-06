-- Accent colour preset for quotation & invoice documents

alter table public.organizations
  add column if not exists document_theme text not null default 'blue';

alter table public.organizations
  drop constraint if exists organizations_document_theme_check;

alter table public.organizations
  add constraint organizations_document_theme_check
  check (document_theme in ('blue', 'slate', 'teal', 'navy', 'maroon', 'charcoal'));
