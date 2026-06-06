import { OrgMissing } from "@/components/error/org-missing";
import { PageHeader } from "@/components/layout/page-header";
import { OrganizationForm } from "@/components/settings/organization-form";
import { getCurrentOrg } from "@/lib/org";

export default async function SettingsPage() {
  const { org } = await getCurrentOrg();
  if (!org) return <OrgMissing />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Add company details and choose what appears on quotations and invoices"
      />
      <OrganizationForm org={org} />
    </div>
  );
}
