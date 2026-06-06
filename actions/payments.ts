"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import {
  parseDecimalToPaise,
  paiseToDecimal,
  sumPaymentsPaise,
} from "@/lib/money";
import { revalidateDashboard } from "@/lib/revalidate-dashboard";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { paymentSchema } from "@/lib/validations/invoice";
import type { InvoiceStatus } from "@/types/database";

function deriveStatus(
  totalPaise: number,
  paidPaise: number,
  current: InvoiceStatus,
): InvoiceStatus {
  if (current === "cancelled") return "cancelled";
  if (paidPaise >= totalPaise) return "paid";
  if (paidPaise > 0) return "partially_paid";
  if (current === "draft") return "draft";
  return current === "overdue" ? "overdue" : "sent";
}

async function recomputeInvoicePayment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  invoiceId: string,
  orgId: string,
) {
  const { data: invoice } = await supabase
    .from("invoices")
    .select("total, status")
    .eq("id", invoiceId)
    .eq("org_id", orgId)
    .single();

  if (!invoice) return;

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", invoiceId);

  const paidPaise = sumPaymentsPaise(
    (payments ?? []).map((p) => String(p.amount)),
  );
  const totalPaise = parseDecimalToPaise(String(invoice.total));
  const status = deriveStatus(
    totalPaise,
    paidPaise,
    invoice.status as InvoiceStatus,
  );

  await supabase
    .from("invoices")
    .update({
      amount_paid: paiseToDecimal(paidPaise),
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("org_id", orgId);
}

export async function createPaymentAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = paymentSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, total, amount_paid, status")
    .eq("id", parsed.data.invoiceId)
    .eq("org_id", org.id)
    .single();

  if (!invoice) return fail("Invoice not found");
  if (invoice.status === "cancelled") return fail("Invoice is cancelled");

  const { error } = await supabase.from("payments").insert({
    org_id: org.id,
    invoice_id: parsed.data.invoiceId,
    amount: parsed.data.amount,
    method: parsed.data.method,
    paid_at: new Date(parsed.data.paidAt).toISOString(),
    note: parsed.data.note || null,
  });

  if (error) return fail(error.message);

  await recomputeInvoicePayment(supabase, parsed.data.invoiceId, org.id);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${parsed.data.invoiceId}`);
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
  return ok();
}

export async function deletePaymentFormAction(formData: FormData): Promise<void> {
  const paymentId = formData.get("paymentId");
  if (typeof paymentId !== "string" || !paymentId) {
    throw new Error("Missing payment id");
  }
  return deletePaymentAction(paymentId);
}

export async function deletePaymentAction(paymentId: string): Promise<void> {
  const { org } = await getCurrentOrg();
  if (!org) throw new Error("Organization not found");

  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("invoice_id")
    .eq("id", paymentId)
    .eq("org_id", org.id)
    .single();

  if (!payment) throw new Error("Payment not found");

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
    .eq("org_id", org.id);

  if (error) throw new Error(error.message);

  await recomputeInvoicePayment(supabase, payment.invoice_id, org.id);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${payment.invoice_id}`);
  revalidatePath("/dashboard");
  revalidateDashboard(org.id);
}
