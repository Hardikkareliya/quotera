"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { buildDocumentAmounts } from "@/lib/documents";
import { parseTaxMode } from "@/lib/tax-mode";
import { buildDbLineItemFields } from "@/lib/line-items";
import { revalidateDashboard } from "@/lib/revalidate-dashboard";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { invoiceSchema } from "@/lib/validations/invoice";

export async function createInvoiceAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("state_code")
    .eq("id", parsed.data.clientId)
    .eq("org_id", org.id)
    .single();

  if (!client) return fail("Client not found");

  const amounts = buildDocumentAmounts(
    parsed.data.items,
    org,
    parsed.data.taxMode,
  );

  const { data: number, error: numError } = await supabase.rpc(
    "next_invoice_number",
    { _org_id: org.id },
  );

  if (numError || !number) return fail(numError?.message ?? "Numbering failed");

  const { data: invoice, error: invError } = await supabase
    .from("invoices")
    .insert({
      org_id: org.id,
      client_id: parsed.data.clientId,
      quotation_id: parsed.data.quotationId || null,
      number,
      status: "draft",
      issue_date: parsed.data.issueDate,
      due_date: parsed.data.dueDate || null,
      subtotal: amounts.subtotal,
      tax_total: amounts.taxTotal,
      total: amounts.total,
      tax_mode: parsed.data.taxMode,
      amount_paid: "0",
      place_of_supply: client.state_code,
      notes: parsed.data.notes || null,
      terms: parsed.data.terms || null,
    })
    .select("id")
    .single();

  if (invError || !invoice) return fail(invError?.message ?? "Create failed");

  const items = parsed.data.items.map((item, idx) => ({
    invoice_id: invoice.id,
    ...buildDbLineItemFields(item, amounts.lineTotals[idx], idx),
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(items);

  if (itemsError) return fail(itemsError.message);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok({ id: invoice.id });
}

export async function updateInvoiceAction(
  id: string,
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = invoiceSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("state_code")
    .eq("id", parsed.data.clientId)
    .eq("org_id", org.id)
    .single();

  if (!client) return fail("Client not found");

  const amounts = buildDocumentAmounts(
    parsed.data.items,
    org,
    parsed.data.taxMode,
  );

  const { error: invError } = await supabase
    .from("invoices")
    .update({
      client_id: parsed.data.clientId,
      issue_date: parsed.data.issueDate,
      due_date: parsed.data.dueDate || null,
      subtotal: amounts.subtotal,
      tax_total: amounts.taxTotal,
      total: amounts.total,
      tax_mode: parsed.data.taxMode,
      place_of_supply: client.state_code,
      notes: parsed.data.notes || null,
      terms: parsed.data.terms || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", org.id);

  if (invError) return fail(invError.message);

  await supabase.from("invoice_items").delete().eq("invoice_id", id);

  const items = parsed.data.items.map((item, idx) => ({
    invoice_id: id,
    ...buildDbLineItemFields(item, amounts.lineTotals[idx], idx),
  }));

  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(items);

  if (itemsError) return fail(itemsError.message);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return ok();
}

export async function convertQuotationToInvoiceFormAction(
  formData: FormData,
): Promise<void> {
  const quotationId = formData.get("quotationId");
  if (typeof quotationId !== "string" || !quotationId) {
    throw new Error("Missing quotation id");
  }
  const result = await convertQuotationToInvoiceAction(quotationId);
  if (!result.success) throw new Error(result.error);
  redirect(`/invoices/${result.data!.id}?created=1`);
}

export async function convertQuotationToInvoiceAction(
  quotationId: string,
): Promise<ActionResult<{ id: string }>> {
  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();

  const { data: quote, error: quoteError } = await supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .eq("id", quotationId)
    .eq("org_id", org.id)
    .single();

  if (quoteError) return fail(quoteError.message);
  if (!quote) return fail("Quotation not found");

  const rawItems = quote.quotation_items as Array<{
    description: string;
    sub_description?: string | null;
    pricing_mode?: string | null;
    hsn_sac: string | null;
    qty: string;
    unit_price: string;
    tax_rate: string;
    sort_order: number;
  }> | null;

  if (!rawItems?.length) {
    return fail("Quotation has no line items");
  }

  const items = [...rawItems]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({
      description: i.description,
      subDescription: i.sub_description ?? "",
      pricingMode: (i.pricing_mode === "fixed" ? "fixed" : "qty_rate") as
        | "fixed"
        | "qty_rate",
      hsnSac: i.hsn_sac ?? "",
      qty: String(i.qty),
      unitPrice: String(i.unit_price),
      taxRate: String(i.tax_rate),
    }));

  const result = await createInvoiceAction({
    clientId: quote.client_id,
    quotationId: quote.id,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    taxMode: parseTaxMode(quote.tax_mode),
    notes: quote.notes ?? "",
    terms: quote.terms ?? "",
    items,
  });

  if (!result.success) return result;

  const invoiceId = result.data?.id;
  if (!invoiceId) return fail("Invoice could not be created");

  revalidatePath("/quotations");
  revalidatePath(`/quotations/${quotationId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);

  return ok({ id: invoiceId });
}

export async function updateInvoiceStatusAction(
  id: string,
  status: string,
): Promise<ActionResult<void>> {
  const allowed = [
    "draft",
    "sent",
    "partially_paid",
    "paid",
    "overdue",
    "cancelled",
  ];
  if (!allowed.includes(status)) return fail("Invalid status");

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return ok();
}

const MAX_BULK_DELETE = 50;

function normalizeBulkIds(ids: string[]): string[] | null {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return null;
  if (unique.length > MAX_BULK_DELETE) return null;
  return unique;
}

/** Delete from list UI — stays on invoices page after success. */
export async function deleteInvoiceListAction(
  id: string,
): Promise<ActionResult<void>> {
  const result = await deleteInvoicesBulkListAction([id]);
  if (!result.success) return result;
  return ok();
}

export async function deleteInvoicesBulkListAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  const unique = normalizeBulkIds(ids);
  if (!unique) {
    return fail(
      ids.length === 0
        ? "Nothing selected"
        : `Select at most ${MAX_BULK_DELETE} items`,
    );
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("invoices")
    .delete({ count: "exact" })
    .in("id", unique)
    .eq("org_id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok({ deleted: count ?? unique.length });
}

export async function deleteInvoiceFormAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing invoice id");
  return deleteInvoiceAction(id);
}

export async function deleteInvoiceAction(id: string): Promise<void> {
  const { org } = await getCurrentOrg();
  if (!org) throw new Error("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) throw new Error(error.message);

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  redirect("/invoices");
}
