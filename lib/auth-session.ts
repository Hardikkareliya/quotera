import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Reads the session from cookies (local JWT) — no Auth server round trip.
 * Protected routes are already gated in middleware; this keeps dashboard pages fast.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
});

/** Use before mutations when you need a server-validated user identity. */
export const getValidatedAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
