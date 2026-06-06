import {
  createQuotationAction,
  updateQuotationAction,
} from "@/actions/quotations";
import {
  createInvoiceAction,
  updateInvoiceAction,
} from "@/actions/invoices";
import { DocumentForm } from "@/components/documents/document-form";
import { PageShell } from "@/components/layout/page-shell";
import { getDocumentTheme } from "@/lib/document-theme";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function NewQuotationPage() {
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
      title="New quotation"
      description="Create a quote to send to your client"
      backHref="/quotations"
      backLabel="Quotations"
      breadcrumbs={[
        { label: "Quotations", href: "/quotations" },
        { label: "New" },
      ]}
    >
      <DocumentForm
        type="quotation"
        clients={clients ?? []}
        org={org}
        accentTheme={accentTheme}
        hasOrgGstin={Boolean(org.gstin?.trim())}
        cancelHref="/quotations"
        listHref="/quotations"
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
