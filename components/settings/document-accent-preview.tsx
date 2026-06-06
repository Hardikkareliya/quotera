"use client";

import { getDocumentTheme, type DocumentThemeTokens } from "@/lib/document-theme";

export function DocumentAccentPreview({
  theme,
  type = "quotation",
}: {
  theme: DocumentThemeTokens;
  type?: "quotation" | "invoice";
}) {
  const heading = type === "quotation" ? "QUOTATION" : "TAX INVOICE";

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-sm">
      <div className="h-[3px]" style={{ backgroundColor: theme.accent }} />
      <div className="px-4 py-3">
        <p
          className="text-lg font-semibold tracking-wide"
          style={{ color: theme.accent }}
        >
          {heading}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sample heading · total bar uses this colour
        </p>
        <div
          className="mt-3 flex justify-end border-t pt-2 text-sm font-semibold"
          style={{ borderTopColor: theme.accent, color: theme.accent }}
        >
          ₹1,050.00
        </div>
      </div>
    </div>
  );
}

export function themeFromFormValues(
  documentTheme: string,
  documentAccentCustom?: string,
): DocumentThemeTokens {
  return getDocumentTheme(documentTheme, documentAccentCustom);
}
