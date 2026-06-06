import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  convertQuotationToInvoiceAction,
  createInvoiceAction,
  updateInvoiceAction,
  updateInvoiceStatusAction,
} from "@/actions/invoices";
import { ConvertToInvoiceButton } from "@/components/quotations/convert-to-invoice-button";
import {
  createQuotationAction,
  deleteQuotationFormAction,
  updateQuotationAction,
  updateQuotationStatusAction,
} from "@/actions/quotations";
import { DocumentActionsPanel } from "@/components/documents/document-actions-panel";
import { DocumentCreatedBanner } from "@/components/documents/document-created-banner";
import { DocumentPreviewCard } from "@/components/documents/document-preview-card";
import { clientToBillTo } from "@/lib/document-bill-to";
import { DocumentForm } from "@/components/documents/document-form";
import { DocumentStatusForm } from "@/components/documents/document-status-form";
import { PageShell } from "@/components/layout/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getRequestOrigin, pdfDocumentUrl } from "@/lib/app-url";
import { getDocumentTheme } from "@/lib/document-theme";
import { parseTaxMode } from "@/lib/tax-mode";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { org } = await getCurrentOrg();
  if (!org) return null;

  const supabase = await createClient();

  const [quoteResult, clientsResult] = await Promise.all([
    supabase
      .from("quotations")
      .select("*, clients(*), quotation_items(*)")
      .eq("id", id)
      .eq("org_id", org.id)
      .single(),
    supabase
      .from("clients")
      .select("id, name, state_code, company, billing_address, gstin, phone, email")
      .eq("org_id", org.id)
      .order("name"),
  ]);

  const quote = quoteResult.data;
  if (!quote) notFound();

  const clients = clientsResult.data;

  const client = quote.clients as {
    name: string;
    company: string | null;
    billing_address: string | null;
    gstin: string | null;
    phone: string | null;
    email: string | null;
    state_code: string;
  };
  const items = (
    quote.quotation_items as Array<{
      description: string;
      sub_description: string | null;
      pricing_mode: string;
      hsn_sac: string | null;
      qty: string;
      unit_price: string;
      tax_rate: string;
      line_total: string;
      sort_order: number;
    }>
  ).sort((a, b) => a.sort_order - b.sort_order);

  const hasOrgGstin = Boolean(org.gstin?.trim());
  const origin = await getRequestOrigin();
  const pdfUrl = pdfDocumentUrl(origin, "quotation", id);
  const accentTheme = getDocumentTheme(org.document_theme, org.document_accent_custom);

  return (
    <PageShell
      title={quote.number}
      description={client.name}
      backHref="/quotations"
      backLabel="Quotations"
      breadcrumbs={[
        { label: "Quotations", href: "/quotations" },
        { label: quote.number },
      ]}
      actions={<StatusBadge status={quote.status} />}
      contentClassName="w-full"
    >
      <div className="w-full min-w-0 space-y-6">
        <Suspense fallback={null}>
          <DocumentCreatedBanner type="quotation" />
        </Suspense>

        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:items-start xl:gap-8">
          <div className="min-w-0 space-y-8">
            <DocumentStatusForm
              type="quotation"
              id={id}
              currentStatus={quote.status}
              updateQuotationStatus={updateQuotationStatusAction}
              updateInvoiceStatus={updateInvoiceStatusAction}
            />

            <section className="min-w-0 space-y-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Edit quotation
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Change client, dates, line items, or notes — then save.
                </p>
              </div>
              <DocumentForm
                type="quotation"
                layout="simple"
                documentId={id}
                clients={clients ?? []}
                org={org}
                accentTheme={accentTheme}
                hasOrgGstin={hasOrgGstin}
                documentNumber={quote.number}
                cancelHref="/quotations"
                listHref="/quotations"
                actions={{
                  createQuotation: createQuotationAction,
                  updateQuotation: updateQuotationAction,
                  createInvoice: createInvoiceAction,
                  updateInvoice: updateInvoiceAction,
                }}
                defaultValues={{
                  clientId: quote.client_id,
                  issueDate: quote.issue_date,
                  validUntil: quote.valid_until ?? "",
                  taxMode: parseTaxMode(quote.tax_mode),
                  notes: quote.notes ?? "",
                  terms: quote.terms ?? "",
                  items: items.map((i) => ({
                    description: i.description,
                    subDescription: i.sub_description ?? "",
                    pricingMode:
                      i.pricing_mode === "fixed"
                        ? ("fixed" as const)
                        : ("qty_rate" as const),
                    hsnSac: "",
                    qty: String(i.qty),
                    unitPrice: String(i.unit_price),
                    taxRate: String(i.tax_rate),
                  })),
                }}
              />
            </section>

            <DocumentActionsPanel
              type="quotation"
              id={id}
              number={quote.number}
              total={String(quote.total)}
              companyName={org.name}
              pdfUrl={pdfUrl}
              clientPhone={client.phone}
              clientEmail={client.email}
              convertToInvoiceForm={
                <ConvertToInvoiceButton
                  quotationId={id}
                  convertAction={convertQuotationToInvoiceAction}
                />
              }
            />

            <form action={deleteQuotationFormAction}>
              <input type="hidden" name="id" value={id} />
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="rounded-lg"
              >
                Delete quotation
              </Button>
            </form>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <DocumentPreviewCard
              type="quotation"
              org={org}
              accentTheme={accentTheme}
              documentNumber={quote.number}
              billTo={clientToBillTo(client)}
              issueDate={quote.issue_date}
              secondaryDate={quote.valid_until}
              taxMode={quote.tax_mode}
              items={items.map((i) => ({
                description: i.description,
                subDescription: i.sub_description,
                pricingMode: i.pricing_mode,
                qty: String(i.qty),
                unitPrice: String(i.unit_price),
                taxRate: String(i.tax_rate),
                lineTotal: String(i.line_total),
              }))}
              subtotal={String(quote.subtotal)}
              taxTotal={String(quote.tax_total)}
              total={String(quote.total)}
              notes={quote.notes}
              terms={quote.terms}
            />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
