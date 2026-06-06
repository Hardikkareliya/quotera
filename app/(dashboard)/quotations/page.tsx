import { OrgMissing } from "@/components/error/org-missing";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import {
  deleteQuotationListAction,
  deleteQuotationsBulkListAction,
  updateQuotationStatusAction,
} from "@/actions/quotations";
import {
  QuotationsListTable,
  type QuotationListItem,
} from "@/components/quotations/quotations-list-table";
import { clientNameFromJoin } from "@/lib/joined-client";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function QuotationsPage() {
  const { org } = await getCurrentOrg();
  if (!org) return <OrgMissing />;

  const supabase = await createClient();
  const { data: quotes, error } = await supabase
    .from("quotations")
    .select("id, number, issue_date, total, status, clients(name)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const listItems: QuotationListItem[] = (quotes ?? []).map((q) => ({
    id: q.id,
    number: q.number,
    clientName: clientNameFromJoin(q.clients),
    issueDate: q.issue_date,
    total: String(q.total),
    status: q.status,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quotations"
        description="Create and share professional quotes"
        action={{ label: "New quotation", href: "/quotations/new" }}
      />

      {!listItems.length ? (
        <EmptyState
          title="No quotations yet"
          description="Create a professional quotation and share via WhatsApp or email."
          actionLabel="Create quotation"
          actionHref="/quotations/new"
        />
      ) : (
        <QuotationsListTable
          quotes={listItems}
          actions={{
            updateStatus: updateQuotationStatusAction,
            deleteQuote: deleteQuotationListAction,
            deleteMany: deleteQuotationsBulkListAction,
          }}
        />
      )}
    </div>
  );
}
