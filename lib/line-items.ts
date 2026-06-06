import {
  computeLineTotalPaise,
  parseDecimalToPaise,
  type LineItemInput,
  type PricingMode,
} from "@/lib/money";

export type { PricingMode };

export const GST_PRESET_RATES = ["0", "5", "12", "18", "28"] as const;

export type FormLineItem = {
  description: string;
  subDescription?: string;
  hsnSac?: string;
  pricingMode?: PricingMode;
  qty?: string;
  unitPrice: string;
  taxRate?: string;
};

export function toMoneyLineItem(item: FormLineItem): LineItemInput {
  const mode = item.pricingMode ?? "qty_rate";
  return {
    pricingMode: mode,
    qty: mode === "fixed" ? "1" : (item.qty?.trim() || "1"),
    unitPrice: item.unitPrice,
    taxRate: item.taxRate ?? "0",
  };
}

export function buildDbLineItemFields(
  item: FormLineItem,
  lineTotal: string,
  sortOrder: number,
) {
  const mode = item.pricingMode ?? "qty_rate";
  return {
    description: item.description,
    sub_description: item.subDescription?.trim() || null,
    pricing_mode: mode,
    hsn_sac: item.hsnSac?.trim() || null,
    qty: mode === "fixed" ? 1 : (item.qty?.trim() || "1"),
    unit_price: item.unitPrice,
    tax_rate: item.taxRate || "0",
    line_total: lineTotal,
    sort_order: sortOrder,
  };
}

export function isPresetGstRate(rate: string): boolean {
  return (GST_PRESET_RATES as readonly string[]).includes(rate);
}

export function formatTaxRatePercent(rate: string): string {
  const n = parseFloat(String(rate).replace(/,/g, ""));
  if (Number.isNaN(n) || n === 0) return "—";
  const text = Number.isInteger(n) ? String(n) : String(n);
  return `${text}%`;
}

/** @deprecated Use formatTaxRatePercent with taxColumnLabel instead */
export function formatGstRateLabel(rate: string): string {
  const pct = formatTaxRatePercent(rate);
  if (pct === "—") return "No tax";
  return `GST ${pct}`;
}

export function isFixedPricing(mode?: PricingMode | string | null): boolean {
  return mode === "fixed";
}

export function lineQtyDisplay(item: {
  pricingMode?: PricingMode | string | null;
  qty: string;
}): string {
  if (isFixedPricing(item.pricingMode)) return "—";
  return item.qty;
}

export function lineRateDisplay(item: {
  pricingMode?: PricingMode | string | null;
  unitPrice: string;
}): string {
  if (isFixedPricing(item.pricingMode)) return "—";
  return item.unitPrice;
}

export function lineAmountPaise(item: {
  pricingMode?: PricingMode | string | null;
  qty?: string;
  unitPrice: string;
  taxRate?: string;
  lineTotal?: string;
}): number {
  if (item.lineTotal != null && item.lineTotal !== "") {
    return parseDecimalToPaise(item.lineTotal);
  }
  const mode: PricingMode =
    item.pricingMode === "fixed" ? "fixed" : "qty_rate";
  return computeLineTotalPaise({
    pricingMode: mode,
    qty: mode === "fixed" ? "1" : (item.qty?.trim() || "1"),
    unitPrice: item.unitPrice,
    taxRate: item.taxRate ?? "0",
  });
}
