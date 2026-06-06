import {
  createInvoiceAction,
  updateInvoiceAction,
} from "@/actions/invoices";
import {
  createQuotationAction,
  updateQuotationAction,
} from "@/actions/quotations";
import { DocumentForm } from "@/components/documents/document-form";
import { PageShell } from "@/components/layout/page-shell";
import { getDocumentTheme } from "@/lib/document-theme";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function NewInvoicePage() {
  const { org } = await getCurrentOrg();
  if (!org) return null;

  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, state_code, company, billing_address, gstin, phone, email")
    .eq("org_id", org.id)
    .order("name");

  const accentTheme = getDocumentTheme(org.document_theme, org.document_accent_custom);

  return (
    <PageShell
      title="New invoice"
      description="Create a draft invoice for your client"
      backHref="/invoices"
      backLabel="Invoices"
      breadcrumbs={[
        { label: "Invoices", href: "/invoices" },
        { label: "New" },
      ]}
    >
      <DocumentForm
        type="invoice"
        clients={clients ?? []}
        org={org}
        accentTheme={accentTheme}
        hasOrgGstin={Boolean(org.gstin?.trim())}
        cancelHref="/invoices"
        listHref="/invoices"
        actions={{
          createQuotation: createQuotationAction,
          updateQuotation: updateQuotationAction,
          createInvoice: createInvoiceAction,
          updateInvoice: updateInvoiceAction,
        }}
      />
    </PageShell>
  );
}
