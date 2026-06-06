import Link from "next/link";
import { ExternalLink, FileText, List } from "lucide-react";

import { DocumentSharePanel } from "@/components/documents/document-share-panel";
import { Button } from "@/components/ui/button";

type Props = {
  type: "quotation" | "invoice";
  id: string;
  number: string;
  total: string;
  companyName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  pdfUrl: string;
  convertToInvoiceForm?: React.ReactNode;
};

export function DocumentActionsPanel({
  type,
  id,
  number,
  total,
  companyName,
  clientPhone,
  clientEmail,
  pdfUrl,
  convertToInvoiceForm,
}: Props) {
  const pdfPath = `/api/pdf/${type}/${id}`;
  const listHref = type === "quotation" ? "/quotations" : "/invoices";
  const listLabel = type === "quotation" ? "All quotations" : "All invoices";

  return (
    <section className="w-full rounded-xl border border-border bg-card p-5 shadow-card md:p-6">
      <h2 className="text-base font-semibold text-foreground">PDF & share</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Open the PDF, then send it to your client on WhatsApp or email.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="h-11 flex-1 gap-2">
          <a href={pdfPath} target="_blank" rel="noreferrer">
            <FileText className="size-4" />
            View PDF
            <ExternalLink className="size-3.5 opacity-70" />
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11 flex-1 gap-2">
          <Link href={listHref}>
            <List className="size-4" />
            {listLabel}
          </Link>
        </Button>
      </div>

      <DocumentSharePanel
        type={type}
        id={id}
        number={number}
        total={total}
        companyName={companyName}
        pdfUrl={pdfUrl}
        clientPhone={clientPhone}
        clientEmail={clientEmail}
      />

      {convertToInvoiceForm ? (
        <div className="mt-5 rounded-lg border border-dashed border-border bg-muted/20 p-4">
          <p className="text-sm font-medium text-foreground">Client accepted?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create an invoice from this quotation in one click.
          </p>
          <div className="mt-3">{convertToInvoiceForm}</div>
        </div>
      ) : null}
    </section>
  );
}
