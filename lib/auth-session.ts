import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** Deduped per request — avoids multiple getUser() round trips. */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
