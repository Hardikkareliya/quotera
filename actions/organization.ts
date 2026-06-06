"use server";

import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { normalizeGstin } from "@/lib/gstin";
import { normalizeHexColor } from "@/lib/document-theme";
import {
  normalizeWebsite,
  organizationSchema,
} from "@/lib/validations/organization";

export async function updateOrganizationAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = organizationSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const supabase = await createClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      name: parsed.data.name,
      gstin: parsed.data.gstin
        ? normalizeGstin(parsed.data.gstin) || null
        : null,
      pan: parsed.data.pan?.toUpperCase() || null,
      address: parsed.data.address || null,
      state_code: parsed.data.stateCode,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      website: normalizeWebsite(parsed.data.website ?? ""),
      bank_name: parsed.data.bankName || null,
      bank_account: parsed.data.bankAccount || null,
      bank_ifsc: parsed.data.bankIfsc?.toUpperCase() || null,
      invoice_prefix: parsed.data.invoicePrefix,
      quote_prefix: parsed.data.quotePrefix,
      document_visibility: parsed.data.documentVisibility,
      document_theme: parsed.data.documentTheme,
      document_accent_custom:
        parsed.data.documentTheme === "custom"
          ? normalizeHexColor(parsed.data.documentAccentCustom)
          : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", org.id);

  if (error) return fail(error.message);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/quotations", "layout");
  revalidatePath("/invoices", "layout");
  return ok();
}

export async function uploadOrgAssetAction(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const { org } = await getCurrentOrg();
  if (!org) return fail("Organization not found");

  const field = formData.get("field");
  const file = formData.get("file");

  if (
    field !== "logo" &&
    field !== "signature" &&
    field !== "payment_qr"
  ) {
    return fail("Invalid field");
  }

  if (!(file instanceof File) || file.size === 0) {
    return fail("No file provided");
  }

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${org.id}/${field}-${Date.now()}.${ext}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("org-assets")
    .upload(path, file, { upsert: true });

  if (uploadError) return fail(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("org-assets").getPublicUrl(path);

  const column =
    field === "logo"
      ? "logo_url"
      : field === "signature"
        ? "signature_url"
        : "payment_qr_url";

  const { error: updateError } = await supabase
    .from("organizations")
    .update({ [column]: publicUrl })
    .eq("id", org.id);

  if (updateError) return fail(updateError.message);

  revalidatePath("/settings");
  revalidatePath("/quotations", "layout");
  revalidatePath("/invoices", "layout");
  return ok({ url: publicUrl });
}
