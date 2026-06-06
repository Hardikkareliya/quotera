/** All money math in integer paise — never use JS floats for currency. */

import { type TaxMode } from "@/lib/tax-mode";

export type PricingMode = "qty_rate" | "fixed";

export type LineItemInput = {
  qty: string;
  unitPrice: string;
  taxRate: string;
  pricingMode?: PricingMode;
};

export type TaxBreakup = {
  subtotalPaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxTotalPaise: number;
  totalPaise: number;
};

export function parseDecimalToPaise(value: string | number): number {
  const s = String(value).trim().replace(/,/g, "");
  if (!s || s === "-") return 0;
  const negative = s.startsWith("-");
  const normalized = negative ? s.slice(1) : s;
  const parts = normalized.split(".");
  const whole = parseInt(parts[0] || "0", 10);
  const frac = (parts[1] || "").padEnd(2, "0").slice(0, 2);
  const paise = whole * 100 + parseInt(frac || "0", 10);
  return negative ? -paise : paise;
}

export function paiseToDecimal(paise: number): string {
  const negative = paise < 0;
  const abs = Math.abs(paise);
  const whole = Math.floor(abs / 100);
  const frac = String(abs % 100).padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${frac}`;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
}

/** react-pdf Helvetica cannot render ₹ (shows as "1") — use Rs. prefix. */
export function formatINRPdf(paise: number): string {
  const negative = paise < 0;
  const abs = Math.abs(paise);
  const num = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs / 100);
  return `${negative ? "-" : ""}Rs. ${num}`;
}

export function formatMoneyPdf(amount: string | number): string {
  return formatINRPdf(parseDecimalToPaise(String(amount)));
}

export function computeLineTotalPaise(item: LineItemInput): number {
  const unitPaise = parseDecimalToPaise(item.unitPrice);
  if (item.pricingMode === "fixed") {
    return unitPaise;
  }
  const qtyNum = parseFloat(String(item.qty).replace(/,/g, "")) || 0;
  return Math.round(qtyNum * unitPaise);
}

/** Tax on one line (from taxable line amount). */
export function computeLineTaxPaise(
  lineSubtotalPaise: number,
  taxRate: string,
  taxEnabled: boolean,
): number {
  if (!taxEnabled || lineSubtotalPaise <= 0) return 0;
  const rate = parseFloat(String(taxRate).replace(/,/g, "")) || 0;
  if (rate <= 0) return 0;
  return Math.round((lineSubtotalPaise * rate) / 100);
}

/** Taxable line amount + line tax (what the client pays for that line). */
export function computeLineGrossPaise(
  item: LineItemInput,
  taxEnabled: boolean,
): number {
  const subtotalPaise = computeLineTotalPaise(item);
  return subtotalPaise + computeLineTaxPaise(subtotalPaise, item.taxRate, taxEnabled);
}

export function computeDocumentTotals(
  items: LineItemInput[],
  options: {
    taxEnabled: boolean;
    taxMode?: TaxMode;
  },
): TaxBreakup {
  let subtotalPaise = 0;
  let taxTotalPaise = 0;

  const useGstSplit =
    options.taxEnabled && (options.taxMode ?? "gst") === "gst";

  for (const item of items) {
    const lineSubtotal = computeLineTotalPaise(item);
    subtotalPaise += lineSubtotal;

    if (!options.taxEnabled) continue;

    const rate = parseFloat(String(item.taxRate).replace(/,/g, "")) || 0;
    const lineTax = Math.round((lineSubtotal * rate) / 100);
    taxTotalPaise += lineTax;
  }

  let cgstPaise = 0;
  let sgstPaise = 0;
  let igstPaise = 0;

  if (options.taxEnabled && taxTotalPaise > 0) {
    if (useGstSplit) {
      cgstPaise = Math.floor(taxTotalPaise / 2);
      sgstPaise = taxTotalPaise - cgstPaise;
    } else {
      igstPaise = taxTotalPaise;
    }
  }

  return {
    subtotalPaise,
    cgstPaise,
    sgstPaise,
    igstPaise,
    taxTotalPaise,
    totalPaise: subtotalPaise + taxTotalPaise,
  };
}

export function sumPaymentsPaise(amounts: string[]): number {
  return amounts.reduce((sum, a) => sum + parseDecimalToPaise(a), 0);
}
