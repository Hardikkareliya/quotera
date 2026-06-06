import { cache } from "react";

import { getAuthUser, getValidatedAuthUser } from "@/lib/auth-session";
import { createClient } from "@/lib/supabase/server";
import type { Organization } from "@/types/database";

export const getCurrentOrg = cache(async () => {
  const user = await getAuthUser();
  if (!user) return { user: null, org: null, membership: null };

  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role, organizations(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) return { user, org: null, membership: null };

  const nested = membership.organizations as Organization | Organization[] | null;
  const org = Array.isArray(nested) ? nested[0] ?? null : nested;

  if (!org) {
    return { user, org: null, membership: { org_id: membership.org_id, role: membership.role } };
  }

  return {
    user,
    org,
    membership: { org_id: membership.org_id, role: membership.role },
  };
});

/** After bootstrap RPC — bypasses request cache so layout sees the new org. */
export async function loadOrgAfterBootstrap(userId: string) {
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.org_id)
    .single();

  return org;
}

export async function ensureOrgBootstrap(fullName?: string | null) {
  const supabase = await createClient();
  const user = await getValidatedAuthUser();
  if (!user) return null;

  const { data: orgId, error } = await supabase.rpc("bootstrap_user_org", {
    _full_name: fullName ?? null,
  });

  if (error) {
    const msg = error.message;
    if (msg.includes("bootstrap_user_org")) {
      throw new Error(
        "Run supabase/migrations/20250604000002_bootstrap_user_org.sql in the Supabase SQL Editor.",
      );
    }
    if (msg.includes("schema cache") || msg.includes("Could not find")) {
      throw new Error(
        "Database not set up. Run migrations in Supabase SQL Editor.",
      );
    }
    throw new Error(msg);
  }

  return orgId as string | null;
}
