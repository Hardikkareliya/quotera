"use server";

import { redirect } from "next/navigation";

import { mapAuthError } from "@/lib/auth-errors";
import { fail, ok, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";

export async function loginAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return fail(mapAuthError(error.message));

  // Org bootstrap runs in (dashboard)/layout after session cookies are set
  redirect("/dashboard");
}

export async function registerAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) return fail(mapAuthError(error.message));

  // Email confirmation ON: session may be null until user clicks link in inbox
  if (data.user && data.session) {
    redirect("/dashboard");
  }

  if (data.user && !data.session) {
    return fail(
      "Account created. Check your email for the confirmation link, then sign in. " +
        "For dev without email: Supabase → Authentication → Providers → Email → disable Confirm email.",
    );
  }

  return fail("Could not create account. Try again later.");
}

export async function forgotPasswordAction(
  input: unknown,
): Promise<ActionResult<void>> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/login`,
    },
  );

  if (error) return fail(mapAuthError(error.message));
  return ok();
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
