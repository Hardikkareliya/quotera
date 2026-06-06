import { DataPanel } from "@/components/layout/data-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, formatShortDate } from "@/lib/format";
import {
  formatTaxRatePercent,
  isFixedPricing,
  lineAmountPaise,
  lineQtyDisplay,
  lineRateDisplay,
  type PricingMode,
} from "@/lib/line-items";
import { MarkdownContent } from "@/components/documents/markdown-content";
import { formatINR, parseDecimalToPaise } from "@/lib/money";
import {
  isGstSplitMode,
  isTaxEnabled,
  parseTaxMode,
  taxColumnLabel,
} from "@/lib/tax-mode";

export type DocumentDetailsItem = {
  description: string;
  subDescription?: string | null;
  pricingMode?: PricingMode | string | null;
  hsnSac?: string | null;
  qty: string;
  unitPrice: string;
  taxRate: string;
  lineTotal?: string;
};

type Props = {
  type: "quotation" | "invoice";
  clientName: string;
  clientPhone?: string | null;
  clientEmail?: string | null;
  issueDate: string;
  secondaryDate?: string | null;
  secondaryDateLabel?: string;
  subtotal: string;
  taxTotal: string;
  total: string;
  amountPaid?: string;
  items: DocumentDetailsItem[];
  notes?: string | null;
  terms?: string | null;
  taxMode?: string | null;
};

function lineAmountDisplay(item: DocumentDetailsItem): string {
  return formatINR(lineAmountPaise(item));
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function DocumentDetailsView({
  type,
  clientName,
  clientPhone,
  clientEmail,
  issueDate,
  secondaryDate,
  secondaryDateLabel,
  subtotal,
  taxTotal,
  total,
  amountPaid,
  items,
  notes,
  terms,
  taxMode: taxModeProp,
}: Props) {
  const label = type === "quotation" ? "Quotation" : "Invoice";
  const contact = [clientPhone, clientEmail].filter(Boolean).join(" · ");
  const taxMode = parseTaxMode(taxModeProp);
  const taxEnabled = isTaxEnabled(taxMode);
  const taxTotalPaise = parseDecimalToPaise(taxTotal);
  const taxCol = taxColumnLabel(taxMode);
  const useGstSplit =
    taxEnabled && isGstSplitMode(taxMode) && taxTotalPaise > 0;

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-card md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} details
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailField label="Client" value={clientName} />
          {contact ? (
            <DetailField label="Contact" value={contact} />
          ) : (
            <DetailField label="Contact" value="—" />
          )}
          <DetailField label="Issue date" value={formatShortDate(issueDate)} />
          {secondaryDate && secondaryDateLabel ? (
            <DetailField
              label={secondaryDateLabel}
              value={formatShortDate(secondaryDate)}
            />
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Total amount</p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {formatMoney(total)}
            </p>
            {amountPaid != null ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Paid {formatMoney(amountPaid)} of {formatMoney(total)}
              </p>
            ) : null}
          </div>
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium text-foreground">
                {formatMoney(subtotal)}
              </dd>
            </div>
            {taxEnabled && taxTotalPaise > 0 ? (
              useGstSplit ? (
                <>
                  <div>
                    <dt className="text-muted-foreground">CGST</dt>
                    <dd className="font-medium text-foreground">
                      {formatINR(Math.floor(taxTotalPaise / 2))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">SGST</dt>
                    <dd className="font-medium text-foreground">
                      {formatINR(taxTotalPaise - Math.floor(taxTotalPaise / 2))}
                    </dd>
                  </div>
                </>
              ) : (
                <div>
                  <dt className="text-muted-foreground">IGST</dt>
                  <dd className="font-medium text-foreground">
                    {formatMoney(taxTotal)}
                  </dd>
                </div>
              )
            ) : null}
          </dl>
        </div>
      </div>

      <DataPanel className="w-full min-w-0 p-0">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[520px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                {taxCol ? (
                  <TableHead className="text-right">{taxCol}</TableHead>
                ) : null}
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <TableCell className="py-3 text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="max-w-[320px] py-3">
                    <p className="font-medium text-foreground">
                      {item.description}
                    </p>
                    {item.subDescription?.trim() ? (
                      <div className="mt-1.5">
                        <MarkdownContent text={item.subDescription} />
                      </div>
                    ) : null}
                    {isFixedPricing(item.pricingMode) ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Fixed amount
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="py-3 text-right text-muted-foreground">
                    {lineQtyDisplay(item)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-muted-foreground">
                    {isFixedPricing(item.pricingMode)
                      ? "—"
                      : formatMoney(lineRateDisplay(item))}
                  </TableCell>
                  {taxCol ? (
                    <TableCell className="py-3 text-right text-muted-foreground">
                      {formatTaxRatePercent(item.taxRate)}
                    </TableCell>
                  ) : null}
                  <TableCell className="py-3 text-right font-medium">
                    {lineAmountDisplay(item)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DataPanel>

      {notes?.trim() || terms?.trim() ? (
        <div className="grid gap-4 md:grid-cols-2">
          {notes?.trim() ? (
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                {notes}
              </p>
            </div>
          ) : null}
          {terms?.trim() ? (
            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Terms
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                {terms}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
