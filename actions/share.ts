"use server";

import { Resend } from "resend";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export async function emailDocumentAction(input: {
  type: "quotation" | "invoice";
  id: string;
  toEmail: string;
  pdfUrl: string;
}): Promise<ActionResult<void>> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail("Email service not configured");

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const table = input.type === "quotation" ? "quotations" : "invoices";

  const { data: doc } = await supabase
    .from(table)
    .select("number, total")
    .eq("id", input.id)
    .eq("org_id", org.id)
    .single();

  if (!doc) return fail("Document not found");

  const resend = new Resend(apiKey);
  const label = input.type === "quotation" ? "Quotation" : "Invoice";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Quotera <onboarding@resend.dev>",
    to: input.toEmail,
    subject: `${label} ${doc.number} from ${org.name}`,
    html: `<p>Please find your ${label.toLowerCase()} <strong>${doc.number}</strong> (₹${doc.total}) from ${org.name}.</p><p><a href="${input.pdfUrl}">Download PDF</a></p>`,
  });

  if (error) return fail(error.message);
  return ok();
}
