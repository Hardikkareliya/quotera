import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getDashboardNavContext } from "@/lib/dashboard-context";

export async function DashboardSidebar() {
  const { user, org } = await getDashboardNavContext();
  return <DashboardNav orgName={org?.name} userEmail={user.email} />;
}

export async function DashboardMobileHeader() {
  const { org } = await getDashboardNavContext();
  return <MobileNav orgName={org?.name} />;
}
