import { toMoneyLineItem, type FormLineItem } from "@/lib/line-items";
import {
  computeDocumentTotals,
  computeLineTotalPaise,
  paiseToDecimal,
} from "@/lib/money";
import { isTaxEnabled, type TaxMode } from "@/lib/tax-mode";
import type { Organization } from "@/types/database";

export function buildDocumentAmounts(
  items: FormLineItem[],
  org: Organization,
  taxMode: TaxMode,
) {
  const moneyItems = items.map(toMoneyLineItem);
  const taxEnabled = isTaxEnabled(taxMode);
  const totals = computeDocumentTotals(moneyItems, {
    taxEnabled,
    taxMode: taxEnabled ? taxMode : undefined,
  });

  const lineTotals = moneyItems.map((item) =>
    paiseToDecimal(computeLineTotalPaise(item)),
  );

  return {
    subtotal: paiseToDecimal(totals.subtotalPaise),
    taxTotal: paiseToDecimal(totals.taxTotalPaise),
    total: paiseToDecimal(totals.totalPaise),
    lineTotals,
    taxBreakup: totals,
  };
}
