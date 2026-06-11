"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { earlyAccessSchema } from "@/lib/validations/early-access";

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function submitEarlyAccessAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = earlyAccessSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("early_access_leads").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone,
    business_type: parsed.data.businessType,
    business_type_other:
      parsed.data.businessType === "other"
        ? parsed.data.businessTypeOther?.trim() ?? null
        : null,
    current_workflow: emptyToNull(parsed.data.currentWorkflow),
    needs_notes: emptyToNull(parsed.data.needsNotes),
    monthly_budget: parsed.data.monthlyBudget,
    source: "landing",
  });

  if (error) {
    if (error.code === "23505") {
      return fail("This email is already on the early access list.");
    }
    return fail("Could not submit right now. Please try again or email hello@quotera.in.");
  }

  return ok();
}
