import { cache } from "react";
import { redirect } from "next/navigation";

import { getAuthUser } from "@/lib/auth-session";
import {
  ensureOrgBootstrap,
  getCurrentOrg,
  loadOrgAfterBootstrap,
} from "@/lib/org";

/** One cached org + user lookup for dashboard chrome (sidebar + mobile). */
export const getDashboardNavContext = cache(async () => {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const { org: initialOrg, membership } = await getCurrentOrg();
  let org = initialOrg;

  if (!membership) {
    const meta = user.user_metadata as { full_name?: string };
    await ensureOrgBootstrap(meta.full_name ?? null);
    org = await loadOrgAfterBootstrap(user.id);
  }

  return { user, org };
});
