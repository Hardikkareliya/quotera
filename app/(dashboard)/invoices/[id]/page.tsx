import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  createInvoiceAction,
  deleteInvoiceFormAction,
  updateInvoiceAction,
  updateInvoiceStatusAction,
} from "@/actions/invoices";
import {
  createQuotationAction,
  updateQuotationAction,
  updateQuotationStatusAction,
} from "@/actions/quotations";
import { deletePaymentFormAction } from "@/actions/payments";
import { DocumentActionsPanel } from "@/components/documents/document-actions-panel";
import { DocumentCreatedBanner } from "@/components/documents/document-created-banner";
import { DocumentPreviewCard } from "@/components/documents/document-preview-card";
import { clientToBillTo } from "@/lib/document-bill-to";
import { DocumentForm } from "@/components/documents/document-form";
import { DocumentStatusForm } from "@/components/documents/document-status-form";
import { PaymentForm } from "@/components/invoices/payment-form";
import { PageShell } from "@/components/layout/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/format";
import { getRequestOrigin, pdfDocumentUrl } from "@/lib/app-url";
import { getDocumentTheme } from "@/lib/document-theme";
import { parseTaxMode } from "@/lib/tax-mode";
import { getCurrentOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { org } = await getCurrentOrg();
  if (!org) return null;

  const supabase = await createClient();

  const [invoiceResult, paymentsResult, clientsResult] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, clients(*), invoice_items(*)")
      .eq("id", id)
      .eq("org_id", org.id)
      .single(),
    supabase
      .from("payments")
      .select("id, amount, paid_at")
      .eq("invoice_id", id)
      .order("paid_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name, state_code, company, billing_address, gstin, phone, email")
      .eq("org_id", org.id)
      .order("name"),
  ]);

  const invoice = invoiceResult.data;
  if (!invoice) notFound();

  const payments = paymentsResult.data;
  const clients = clientsResult.data;

  const client = invoice.clients as {
    name: string;
    company: string | null;
    billing_address: string | null;
    gstin: string | null;
    phone: string | null;
    email: string | null;
    state_code: string;
  };

  const items = (
    invoice.invoice_items as Array<{
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
  const pdfUrl = pdfDocumentUrl(origin, "invoice", id);
  const accentTheme = getDocumentTheme(org.document_theme, org.document_accent_custom);

  return (
    <PageShell
      title={invoice.number}
      description={client.name}
      backHref="/invoices"
      backLabel="Invoices"
      breadcrumbs={[
        { label: "Invoices", href: "/invoices" },
        { label: invoice.number },
      ]}
      actions={<StatusBadge status={invoice.status} />}
      contentClassName="w-full"
    >
      <div className="w-full min-w-0 space-y-6">
        <Suspense fallback={null}>
          <DocumentCreatedBanner type="invoice" />
        </Suspense>

        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-2 lg:items-start xl:gap-8">
          <div className="min-w-0 space-y-8">
            <DocumentStatusForm
              type="invoice"
              id={id}
              currentStatus={invoice.status}
              updateQuotationStatus={updateQuotationStatusAction}
              updateInvoiceStatus={updateInvoiceStatusAction}
            />

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-base font-semibold text-foreground">Payments</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Record money received on this invoice
              </p>
              <div className="mt-4">
                <PaymentForm invoiceId={id} />
              </div>
              {payments?.length ? (
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            {new Date(p.paid_at).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatMoney(p.amount)}
                          </TableCell>
                          <TableCell>
                            <form action={deletePaymentFormAction}>
                              <input type="hidden" name="paymentId" value={p.id} />
                              <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                              >
                                Remove
                              </Button>
                            </form>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : null}
            </div>

            <section className="min-w-0 space-y-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Edit invoice
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Change client, dates, line items, or notes — then save.
                </p>
              </div>
              <DocumentForm
                type="invoice"
                layout="simple"
                documentId={id}
                clients={clients ?? []}
                org={org}
                accentTheme={accentTheme}
                hasOrgGstin={hasOrgGstin}
                documentNumber={invoice.number}
                cancelHref="/invoices"
                listHref="/invoices"
                actions={{
                  createQuotation: createQuotationAction,
                  updateQuotation: updateQuotationAction,
                  createInvoice: createInvoiceAction,
                  updateInvoice: updateInvoiceAction,
                }}
                defaultValues={{
                  clientId: invoice.client_id,
                  issueDate: invoice.issue_date,
                  dueDate: invoice.due_date ?? "",
                  taxMode: parseTaxMode(invoice.tax_mode),
                  notes: invoice.notes ?? "",
                  terms: invoice.terms ?? "",
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
              type="invoice"
              id={id}
              number={invoice.number}
              total={String(invoice.total)}
              companyName={org.name}
              pdfUrl={pdfUrl}
              clientPhone={client.phone}
              clientEmail={client.email}
            />

            <form action={deleteInvoiceFormAction}>
              <input type="hidden" name="id" value={id} />
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="rounded-lg"
              >
                Delete invoice
              </Button>
            </form>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <DocumentPreviewCard
              type="invoice"
              org={org}
              accentTheme={accentTheme}
              documentNumber={invoice.number}
              billTo={clientToBillTo(client)}
              issueDate={invoice.issue_date}
              secondaryDate={invoice.due_date}
              taxMode={invoice.tax_mode}
              items={items.map((i) => ({
                description: i.description,
                subDescription: i.sub_description,
                pricingMode: i.pricing_mode,
                qty: String(i.qty),
                unitPrice: String(i.unit_price),
                taxRate: String(i.tax_rate),
                lineTotal: String(i.line_total),
              }))}
              subtotal={String(invoice.subtotal)}
              taxTotal={String(invoice.tax_total)}
              total={String(invoice.total)}
              notes={invoice.notes}
              terms={invoice.terms}
            />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
