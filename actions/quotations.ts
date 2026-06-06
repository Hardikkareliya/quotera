"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { buildDocumentAmounts } from "@/lib/documents";
import { buildDbLineItemFields } from "@/lib/line-items";
import { revalidateDashboard } from "@/lib/revalidate-dashboard";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { quotationSchema } from "@/lib/validations/quotation";

export async function createQuotationAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = quotationSchema.safeParse(input);
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
    "next_quote_number",
    { _org_id: org.id },
  );

  if (numError || !number) return fail(numError?.message ?? "Numbering failed");

  const { data: quote, error: quoteError } = await supabase
    .from("quotations")
    .insert({
      org_id: org.id,
      client_id: parsed.data.clientId,
      number,
      status: "draft",
      issue_date: parsed.data.issueDate,
      valid_until: parsed.data.validUntil || null,
      subtotal: amounts.subtotal,
      tax_total: amounts.taxTotal,
      total: amounts.total,
      tax_mode: parsed.data.taxMode,
      notes: parsed.data.notes || null,
      terms: parsed.data.terms || null,
    })
    .select("id")
    .single();

  if (quoteError || !quote) return fail(quoteError?.message ?? "Create failed");

  const items = parsed.data.items.map((item, idx) => ({
    quotation_id: quote.id,
    ...buildDbLineItemFields(item, amounts.lineTotals[idx], idx),
  }));

  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(items);

  if (itemsError) return fail(itemsError.message);

  revalidatePath("/quotations");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok({ id: quote.id });
}

export async function updateQuotationAction(
  id: string,
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = quotationSchema.safeParse(input);
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

  const { error: quoteError } = await supabase
    .from("quotations")
    .update({
      client_id: parsed.data.clientId,
      issue_date: parsed.data.issueDate,
      valid_until: parsed.data.validUntil || null,
      subtotal: amounts.subtotal,
      tax_total: amounts.taxTotal,
      total: amounts.total,
      tax_mode: parsed.data.taxMode,
      notes: parsed.data.notes || null,
      terms: parsed.data.terms || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", org.id);

  if (quoteError) return fail(quoteError.message);

  await supabase.from("quotation_items").delete().eq("quotation_id", id);

  const items = parsed.data.items.map((item, idx) => ({
    quotation_id: id,
    ...buildDbLineItemFields(item, amounts.lineTotals[idx], idx),
  }));

  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(items);

  if (itemsError) return fail(itemsError.message);

  revalidatePath("/quotations");
  revalidatePath(`/quotations/${id}`);
  return ok();
}

export async function updateQuotationStatusAction(
  id: string,
  status: string,
): Promise<ActionResult<void>> {
  const allowed = ["draft", "sent", "accepted", "rejected", "expired"];
  if (!allowed.includes(status)) return fail("Invalid status");

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("quotations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/quotations");
  revalidatePath(`/quotations/${id}`);
  return ok();
}

const MAX_BULK_DELETE = 50;

function normalizeBulkIds(ids: string[]): string[] | null {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return null;
  if (unique.length > MAX_BULK_DELETE) return null;
  return unique;
}

/** Delete from list UI — stays on quotations page after success. */
export async function deleteQuotationListAction(
  id: string,
): Promise<ActionResult<void>> {
  const result = await deleteQuotationsBulkListAction([id]);
  if (!result.success) return result;
  return ok();
}

export async function deleteQuotationsBulkListAction(
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
    .from("quotations")
    .delete({ count: "exact" })
    .in("id", unique)
    .eq("org_id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/quotations");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok({ deleted: count ?? unique.length });
}

export async function deleteQuotationFormAction(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Missing quotation id");
  return deleteQuotationAction(id);
}

export async function deleteQuotationAction(id: string): Promise<void> {
  const { org } = await getCurrentOrg();
  if (!org) throw new Error("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("quotations")
    .delete()
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) throw new Error(error.message);

  revalidatePath("/quotations");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  redirect("/quotations");
}
