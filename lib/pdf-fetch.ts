import { createClient } from "@/lib/supabase/server";
import type { Organization } from "@/types/database";

export async function fetchQuotationPdfData(id: string) {
  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("quotations")
    .select(
      `
      *,
      clients (name, company, email, phone, billing_address, gstin, state_code),
      quotation_items (*)
    `,
    )
    .eq("id", id)
    .single();

  if (!quote) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", quote.org_id)
    .single();

  if (!org) return null;

  type Item = {
    description: string;
    hsn_sac: string | null;
    qty: string;
    unit_price: string;
    tax_rate: string;
    line_total: string;
    sort_order: number;
  };

  const items = [...(quote.quotation_items as Item[])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return { quote, org: org as Organization, items, client: quote.clients };
}

export async function fetchInvoicePdfData(id: string) {
  const supabase = await createClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select(
      `
      *,
      clients (name, company, email, phone, billing_address, gstin, state_code),
      invoice_items (*)
    `,
    )
    .eq("id", id)
    .single();

  if (!invoice) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", invoice.org_id)
    .single();

  if (!org) return null;

  type Item = {
    description: string;
    hsn_sac: string | null;
    qty: string;
    unit_price: string;
    tax_rate: string;
    line_total: string;
    sort_order: number;
  };

  const items = [...(invoice.invoice_items as Item[])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return { invoice, org: org as Organization, items, client: invoice.clients };
}
