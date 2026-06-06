import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getAuthUser } from "@/lib/auth-session";
import {
  ensureOrgBootstrap,
  getCurrentOrg,
  loadOrgAfterBootstrap,
} from "@/lib/org";

async function resolveOrgContext() {
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
}

export async function DashboardSidebar() {
  const { user, org } = await resolveOrgContext();
  return <DashboardNav orgName={org?.name} userEmail={user.email} />;
}

export async function DashboardMobileHeader() {
  const { org } = await resolveOrgContext();
  return <MobileNav orgName={org?.name} />;
}
