"use client";

import { useMemo } from "react";
import { useWatch, type Control } from "react-hook-form";

import {
  formatTaxRatePercent,
  toMoneyLineItem,
  type FormLineItem,
} from "@/lib/line-items";
import {
  computeDocumentTotals,
  computeLineTotalPaise,
  formatINR,
} from "@/lib/money";
import {
  isGstSplitMode,
  isTaxEnabled,
  parseTaxMode,
  taxColumnLabel,
  taxModeSummary,
} from "@/lib/tax-mode";

type ClientOption = {
  id: string;
  name: string;
  state_code: string;
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  clients: ClientOption[];
};

export function DocumentTotalsPreview({ control }: Props) {
  const taxMode = parseTaxMode(
    useWatch({ control, name: "taxMode" }) as string | undefined,
  );
  const taxEnabled = isTaxEnabled(taxMode);
  const items = (useWatch({ control, name: "items" }) ?? []) as FormLineItem[];

  const totals = useMemo(() => {
    const moneyItems = items.map(toMoneyLineItem);
    return computeDocumentTotals(moneyItems, {
      taxEnabled,
      taxMode,
    });
  }, [items, taxEnabled, taxMode]);

  const lineRows = useMemo(() => {
    return items.map((item, index) => {
      const money = toMoneyLineItem(item);
      const subtotalPaise = computeLineTotalPaise(money);
      const rate = parseFloat(String(item.taxRate ?? "0").replace(/,/g, "")) || 0;
      const taxPaise = taxEnabled
        ? Math.round((subtotalPaise * rate) / 100)
        : 0;
      const label =
        item.description?.trim() ||
        `Line ${index + 1}`;
      return {
        label,
        subtotalPaise,
        taxPaise,
        totalPaise: subtotalPaise + taxPaise,
        taxRate: item.taxRate ?? "0",
      };
    });
  }, [items, taxEnabled]);

  const taxCol = taxColumnLabel(taxMode);
  const useGstSplit = taxEnabled && isGstSplitMode(taxMode);
  const hasLines = items.length > 0;

  return (
    <div className="rounded-xl border-2 border-primary/15 bg-primary/5 p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Amount preview</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Updates as you type — same totals that will be saved on PDF
          </p>
        </div>
        {taxEnabled ? (
          <p className="text-xs text-muted-foreground">
            {taxModeSummary(taxMode)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No tax</p>
        )}
      </div>

      {hasLines && taxEnabled ? (
        <ul className="mb-4 divide-y divide-border/60 border-b border-border/60 pb-4">
          {lineRows.map((row, i) => (
            <li
              key={i}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-sm first:pt-0"
            >
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {row.label}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {formatINR(row.subtotalPaise)}
                {taxCol ? (
                  <>
                    {" "}
                    · {taxCol} {formatTaxRatePercent(row.taxRate)}
                    {row.taxPaise > 0 ? (
                      <span className="text-foreground">
                        {" "}
                        ({formatINR(row.taxPaise)})
                      </span>
                    ) : null}
                  </>
                ) : null}
              </span>
              <span className="w-full text-right text-sm font-medium text-foreground sm:w-auto">
                = {formatINR(row.totalPaise)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium tabular-nums text-foreground">
            {formatINR(totals.subtotalPaise)}
          </dd>
        </div>
        {taxEnabled && totals.taxTotalPaise > 0 ? (
          <>
            {useGstSplit ? (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">CGST</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatINR(totals.cgstPaise)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">SGST</dt>
                  <dd className="tabular-nums text-foreground">
                    {formatINR(totals.sgstPaise)}
                  </dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">IGST</dt>
                <dd className="tabular-nums text-foreground">
                  {formatINR(totals.igstPaise)}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Total tax</dt>
              <dd className="tabular-nums text-foreground">
                {formatINR(totals.taxTotalPaise)}
              </dd>
            </div>
          </>
        ) : taxEnabled ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="tabular-nums text-muted-foreground">No tax on lines</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-3">
          <dt className="text-base font-semibold text-foreground">Grand total</dt>
          <dd className="text-lg font-semibold tabular-nums text-foreground">
            {formatINR(totals.totalPaise)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
