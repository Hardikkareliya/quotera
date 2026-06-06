import { OrgMissing } from "@/components/error/org-missing";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import {
  deleteInvoiceListAction,
  deleteInvoicesBulkListAction,
  updateInvoiceStatusAction,
} from "@/actions/invoices";
import {
  InvoicesListTable,
  type InvoiceListItem,
} from "@/components/invoices/invoices-list-table";
import { clientNameFromJoin } from "@/lib/joined-client";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function InvoicesPage() {
  const { org } = await getCurrentOrg();
  if (!org) return <OrgMissing />;

  const supabase = await createClient();
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, number, issue_date, total, amount_paid, status, clients(name)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const listItems: InvoiceListItem[] = (invoices ?? []).map((inv) => ({
    id: inv.id,
    number: inv.number,
    clientName: clientNameFromJoin(inv.clients),
    issueDate: inv.issue_date,
    total: String(inv.total),
    amountPaid: String(inv.amount_paid),
    status: inv.status,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Track billing and payments"
        action={{ label: "New invoice", href: "/invoices/new" }}
      />

      {!listItems.length ? (
        <EmptyState
          title="No invoices yet"
          description="Create invoices, track payments, and share with clients."
          actionLabel="Create invoice"
          actionHref="/invoices/new"
        />
      ) : (
        <InvoicesListTable
          invoices={listItems}
          actions={{
            updateStatus: updateInvoiceStatusAction,
            deleteInvoice: deleteInvoiceListAction,
            deleteMany: deleteInvoicesBulkListAction,
          }}
        />
      )}
    </div>
  );
}
