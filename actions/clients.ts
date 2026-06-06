"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { revalidateDashboard } from "@/lib/revalidate-dashboard";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { clientSchema } from "@/lib/validations/client";

function toDb(input: ReturnType<typeof clientSchema.parse>, orgId: string) {
  return {
    org_id: orgId,
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    company: input.company || null,
    billing_address: input.billingAddress || null,
    gstin: input.gstin || null,
    state_code: input.stateCode,
    notes: input.notes || null,
  };
}

export async function createClientAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(toDb(parsed.data, org.id))
    .select("id")
    .single();

  if (error) return fail(error.message);

  revalidatePath("/clients");
  revalidatePath("/quotations/new");
  revalidatePath("/invoices/new");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok({ id: data.id });
}

export async function updateClientAction(
  id: string,
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      billing_address: parsed.data.billingAddress || null,
      gstin: parsed.data.gstin || null,
      state_code: parsed.data.stateCode,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return ok();
}

export async function deleteClientAction(
  id: string,
): Promise<ActionResult<void>> {
  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();

  const [{ count: quoteCount }, { count: invoiceCount }] = await Promise.all([
    supabase
      .from("quotations")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id)
      .eq("org_id", org.id),
    supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("client_id", id)
      .eq("org_id", org.id),
  ]);

  const quotes = quoteCount ?? 0;
  const invoices = invoiceCount ?? 0;

  if (quotes > 0 || invoices > 0) {
    const parts: string[] = [];
    if (quotes > 0) {
      parts.push(`${quotes} quotation${quotes === 1 ? "" : "s"}`);
    }
    if (invoices > 0) {
      parts.push(`${invoices} invoice${invoices === 1 ? "" : "s"}`);
    }
    return fail(
      `Cannot delete this client — linked to ${parts.join(" and ")}. Delete those documents first from Quotations and Invoices.`,
    );
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) {
    if (error.message.includes("foreign key")) {
      return fail(
        "Cannot delete this client — still linked to quotations or invoices.",
      );
    }
    return fail(error.message);
  }

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok();
}
