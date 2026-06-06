export const TAX_MODES = ["none", "gst", "igst"] as const;
export type TaxMode = (typeof TAX_MODES)[number];

export const DEFAULT_TAX_MODE: TaxMode = "none";

export const TAX_MODE_OPTIONS: {
  value: TaxMode;
  label: string;
  hint: string;
}[] = [
  { value: "none", label: "None", hint: "No tax on this document" },
  { value: "gst", label: "GST", hint: "CGST + SGST" },
  { value: "igst", label: "IGST", hint: "Single IGST" },
];

export function parseTaxMode(value: string | null | undefined): TaxMode {
  if (value === "gst" || value === "igst") return value;
  return "none";
}

export function isTaxEnabled(mode: TaxMode): boolean {
  return mode !== "none";
}

export function isGstSplitMode(mode: TaxMode): boolean {
  return mode === "gst";
}

export function taxModeSummary(mode: TaxMode): string {
  if (mode === "none") return "No tax";
  return mode === "gst" ? "CGST + SGST" : "IGST";
}

/** Line-item table column when tax is enabled (GST vs IGST). */
export function taxColumnLabel(mode: TaxMode): "GST" | "IGST" | null {
  if (mode === "gst") return "GST";
  if (mode === "igst") return "IGST";
  return null;
}

export function defaultTaxModeForOrg(hasGstin: boolean): TaxMode {
  return hasGstin ? "gst" : "none";
}
