import { MarkdownContent } from "@/components/documents/markdown-content";
import { APP_NAME, APP_TAGLINE } from "@/lib/app-brand";
import { buildBillToDetailLines, type DocumentBillToInfo } from "@/lib/document-bill-to";
import { buildOrgDocumentHeader } from "@/lib/document-visibility";
import { getDocumentTheme, type DocumentThemeTokens } from "@/lib/document-theme";
import {
  formatTaxRatePercent,
  isFixedPricing,
  lineQtyDisplay,
  lineRateDisplay,
} from "@/lib/line-items";
import { formatShortDate, formatMoney } from "@/lib/format";
import { stateName } from "@/lib/indian-states";
import { formatINR, parseDecimalToPaise, computeLineTaxPaise } from "@/lib/money";
import type { Organization } from "@/types/database";
import {
  isGstSplitMode,
  isTaxEnabled,
  parseTaxMode,
  taxColumnLabel,
  type TaxMode,
} from "@/lib/tax-mode";

export type DocumentPreviewItem = {
  description: string;
  subDescription?: string | null;
  pricingMode?: string | null;
  qty: string;
  unitPrice: string;
  taxRate: string;
  lineTotal?: string;
};

type Props = {
  type: "quotation" | "invoice";
  variant?: "live" | "saved";
  org: Organization;
  documentNumber: string;
  billTo: DocumentBillToInfo;
  issueDate: string;
  secondaryDate?: string | null;
  taxMode: TaxMode | string | null | undefined;
  items: DocumentPreviewItem[];
  subtotal: string;
  taxTotal: string;
  total: string;
  notes?: string | null;
  terms?: string | null;
  /** When set, overrides org theme (e.g. live colour from settings form). */
  accentTheme?: DocumentThemeTokens;
};

function DocumentMetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-x-3 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium tabular-nums text-neutral-900">{value}</span>
    </div>
  );
}

export function DocumentPreviewCard({
  type,
  variant = "saved",
  org,
  documentNumber,
  billTo,
  issueDate,
  secondaryDate,
  taxMode: taxModeProp,
  items,
  subtotal,
  taxTotal,
  total,
  notes,
  terms,
  accentTheme,
}: Props) {
  const theme =
    accentTheme ?? getDocumentTheme(org.document_theme, org.document_accent_custom);
  const docHeading = type === "quotation" ? "QUOTATION" : "TAX INVOICE";
  const secondaryLabel = type === "quotation" ? "Valid until" : "Due date";
  const taxMode = parseTaxMode(taxModeProp);
  const taxEnabled = isTaxEnabled(taxMode);
  const taxCol = taxColumnLabel(taxMode);
  const useGstSplit = taxEnabled && isGstSplitMode(taxMode);
  const taxTotalPaise = parseDecimalToPaise(taxTotal);
  const colSpan = taxCol ? 5 : 4;

  const filledItems = items.filter(
    (item) =>
      item.description?.trim() &&
      parseDecimalToPaise(item.lineTotal ?? item.unitPrice) > 0,
  );
  const orgHeader = buildOrgDocumentHeader(org, type);
  const billToLines = buildBillToDetailLines(billTo);

  return (
    <div className="min-w-0">
      {variant ? (
        <p className="mb-2 text-[11px] text-muted-foreground">
          {variant === "live" ? "Live preview" : "Preview"} — matches your PDF
          colour setting
        </p>
      ) : null}

      <article className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <div className="h-[3px]" style={{ backgroundColor: theme.accent }} />

        <div className="p-6 sm:p-8">
          {/* Header — company left, document title + dates right */}
          <div className="flex flex-col gap-6 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {orgHeader.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={orgHeader.logoUrl}
                  alt=""
                  className="mb-3 h-14 max-w-[140px] object-contain object-left"
                />
              ) : null}
              <p className="text-base font-semibold leading-snug text-neutral-900">
                {orgHeader.name}
              </p>
              {orgHeader.lines.map((line) => (
                <p
                  key={line}
                  className="mt-0.5 text-xs leading-relaxed text-neutral-600"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="shrink-0 sm:text-right">
              <h1
                className="text-[1.65rem] font-bold leading-none tracking-wide sm:text-[1.85rem]"
                style={{ color: theme.accent }}
              >
                {docHeading}
              </h1>
              <p className="mt-2 font-mono text-sm text-neutral-600">
                {documentNumber}
              </p>
              <div className="mt-4 space-y-1 sm:ml-auto sm:w-fit">
                <DocumentMetaRow
                  label="Issue date"
                  value={formatShortDate(issueDate)}
                />
                {secondaryDate?.trim() ? (
                  <DocumentMetaRow
                    label={secondaryLabel}
                    value={formatShortDate(secondaryDate)}
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Bill to */}
          <div className="mt-6 border-b border-neutral-200 pb-6">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: theme.accent }}
            >
              Bill to
            </p>
            <p className="mt-2.5 text-sm font-semibold leading-snug text-neutral-900">
              {billTo.name}
            </p>
            {billToLines.map((line) => (
              <p
                key={line}
                className="mt-0.5 text-xs leading-relaxed text-neutral-600"
              >
                {line}
              </p>
            ))}
            {billTo.stateCode ? (
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                {stateName(billTo.stateCode)}
              </p>
            ) : null}
          </div>

          {/* Items */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[300px] border-collapse text-sm">
              <thead>
                <tr
                  className="border-b-2 text-left text-[11px] font-semibold uppercase tracking-wide"
                  style={{
                    borderBottomColor: theme.accent,
                    color: theme.accent,
                    backgroundColor: theme.tableHead,
                  }}
                >
                  <th className="px-3 py-2.5">Description</th>
                  <th className="px-2 py-2.5 text-right">Qty</th>
                  <th className="px-2 py-2.5 text-right">Rate</th>
                  {taxCol ? (
                    <th className="px-2 py-2.5 text-right">{taxCol}</th>
                  ) : null}
                  <th className="px-3 py-2.5 text-right">
                    {taxEnabled ? "Amount (incl. tax)" : "Amount"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filledItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={colSpan}
                      className="px-3 py-8 text-center text-neutral-500"
                    >
                      No line items
                    </td>
                  </tr>
                ) : (
                  filledItems.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-100 align-top"
                    >
                      <td className="px-3 py-3">
                        <p className="font-medium text-neutral-900">
                          {item.description}
                        </p>
                        {item.subDescription?.trim() ? (
                          <div className="mt-1 text-neutral-600">
                            <MarkdownContent
                              text={item.subDescription}
                              className="text-xs"
                            />
                          </div>
                        ) : null}
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-neutral-700">
                        {lineQtyDisplay(item)}
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-neutral-700">
                        {isFixedPricing(item.pricingMode)
                          ? "—"
                          : formatMoney(lineRateDisplay(item))}
                      </td>
                      {taxCol ? (
                        <td className="px-2 py-3 text-right tabular-nums text-neutral-700">
                          {formatTaxRatePercent(item.taxRate)}
                        </td>
                      ) : null}
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-neutral-900">
                        {formatINR(
                          (() => {
                            const taxablePaise = parseDecimalToPaise(
                              item.lineTotal ?? item.unitPrice,
                            );
                            return (
                              taxablePaise +
                              computeLineTaxPaise(
                                taxablePaise,
                                item.taxRate,
                                taxEnabled,
                              )
                            );
                          })(),
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <dl className="w-full max-w-xs space-y-2 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-neutral-600">
                  {taxEnabled ? "Subtotal (excl. tax)" : "Subtotal"}
                </dt>
                <dd className="tabular-nums font-medium text-neutral-900">
                  {formatMoney(subtotal)}
                </dd>
              </div>
              {taxEnabled && taxTotalPaise > 0 ? (
                useGstSplit ? (
                  <>
                    <div className="flex justify-between gap-6">
                      <dt className="text-neutral-600">CGST</dt>
                      <dd className="tabular-nums text-neutral-900">
                        {formatINR(Math.floor(taxTotalPaise / 2))}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-6">
                      <dt className="text-neutral-600">SGST</dt>
                      <dd className="tabular-nums text-neutral-900">
                        {formatINR(
                          taxTotalPaise - Math.floor(taxTotalPaise / 2),
                        )}
                      </dd>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between gap-6">
                    <dt className="text-neutral-600">IGST</dt>
                    <dd className="tabular-nums text-neutral-900">
                      {formatMoney(taxTotal)}
                    </dd>
                  </div>
                )
              ) : null}
              <div
                className="flex justify-between gap-6 border-t border-neutral-300 pt-2"
                style={{ borderTopColor: theme.accent }}
              >
                <dt className="font-semibold text-neutral-900">Total</dt>
                <dd
                  className="text-base font-semibold tabular-nums"
                  style={{ color: theme.accent }}
                >
                  {formatMoney(total)}
                </dd>
              </div>
            </dl>
          </div>

          {notes?.trim() || terms?.trim() ? (
            <div className="mt-6 grid gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-2">
              {notes?.trim() ? (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Notes
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-neutral-700">
                    {notes}
                  </p>
                </div>
              ) : null}
              {terms?.trim() ? (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Terms
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-neutral-700">
                    {terms}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {orgHeader.bankLines.length > 0 ||
          orgHeader.signatureUrl ||
          orgHeader.paymentQrUrl ? (
            <div className="mt-6 flex items-end justify-between gap-6 border-t border-neutral-200 pt-6">
              <div className="min-w-0 space-y-0.5 text-xs text-neutral-600">
                {orgHeader.bankLines.map((line, i) => (
                  <p
                    key={line}
                    className={
                      i === 0
                        ? "text-[11px] font-medium uppercase tracking-wide text-neutral-500"
                        : undefined
                    }
                  >
                    {line}
                  </p>
                ))}
                {orgHeader.paymentQrUrl ? (
                  <div className="inline-flex flex-col items-center pt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={orgHeader.paymentQrUrl}
                      alt=""
                      className="size-16 object-contain"
                    />
                    <p className="mt-1 text-center text-[10px] text-neutral-500">
                      Scan to pay
                    </p>
                  </div>
                ) : null}
              </div>
              {orgHeader.signatureUrl ? (
                <div className="flex shrink-0 flex-col items-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={orgHeader.signatureUrl}
                    alt=""
                    className="h-12 max-w-[150px] object-contain object-right"
                  />
                  <p className="mt-1 text-right text-[10px] text-neutral-500">
                    Authorised signatory
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 border-t border-dashed border-neutral-200 pt-4 text-center">
            <p className="text-[10px] leading-relaxed text-neutral-400">
              Powered by{" "}
              <span className="font-semibold text-neutral-500">{APP_NAME}</span>
              <span className="text-neutral-300"> · </span>
              {APP_TAGLINE}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
