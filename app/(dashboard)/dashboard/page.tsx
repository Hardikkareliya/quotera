import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { OrgMissing } from "@/components/error/org-missing";
import { PageHeader } from "@/components/layout/page-header";
import { parseDashboardPeriod } from "@/lib/dashboard-period";
import { getCurrentOrg } from "@/lib/org";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { org } = await getCurrentOrg();
  if (!org) return <OrgMissing />;

  const params = await searchParams;
  const period = parseDashboardPeriod(params.period);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Business overview for ${org.name}`}
      />

      <DashboardToolbar period={period} />

      <DashboardBody orgId={org.id} period={period} />
    </div>
  );
}
