"use client";

import { useMemo } from "react";
import { useWatch, type Control } from "react-hook-form";

import { DocumentPreviewCard } from "@/components/documents/document-preview-card";
import { clientToBillTo } from "@/lib/document-bill-to";
import type { DocumentThemeTokens } from "@/lib/document-theme";
import { toMoneyLineItem, type FormLineItem } from "@/lib/line-items";
import type { Organization } from "@/types/database";
import {
  computeDocumentTotals,
  computeLineTotalPaise,
  formatINR,
  paiseToDecimal,
} from "@/lib/money";
import { isTaxEnabled, parseTaxMode } from "@/lib/tax-mode";

type ClientOption = {
  id: string;
  name: string;
  state_code: string;
  company?: string | null;
  billing_address?: string | null;
  gstin?: string | null;
  phone?: string | null;
  email?: string | null;
};

type Props = {
  type: "quotation" | "invoice";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  clients: ClientOption[];
  org: Organization;
  accentTheme: DocumentThemeTokens;
  documentNumber?: string | null;
};

export function DocumentLivePreview({
  type,
  control,
  clients,
  org,
  accentTheme,
  documentNumber,
}: Props) {
  const clientId = useWatch({ control, name: "clientId" });
  const taxMode = parseTaxMode(
    useWatch({ control, name: "taxMode" }) as string | undefined,
  );
  const taxEnabled = isTaxEnabled(taxMode);
  const issueDate = useWatch({ control, name: "issueDate" }) as string | undefined;
  const validUntil = useWatch({ control, name: "validUntil" }) as string | undefined;
  const dueDate = useWatch({ control, name: "dueDate" }) as string | undefined;
  const notes = useWatch({ control, name: "notes" }) as string | undefined;
  const terms = useWatch({ control, name: "terms" }) as string | undefined;
  const items = (useWatch({ control, name: "items" }) ?? []) as FormLineItem[];

  const client = clients.find((c) => c.id === clientId);

  const totals = useMemo(() => {
    return computeDocumentTotals(items.map(toMoneyLineItem), {
      taxEnabled,
      taxMode,
    });
  }, [items, taxEnabled, taxMode]);

  const previewItems = useMemo(() => {
    return items.map((item, index) => {
      const money = toMoneyLineItem(item);
      return {
        description: item.description?.trim() || `Item ${index + 1}`,
        subDescription: item.subDescription,
        pricingMode: item.pricingMode,
        qty: item.qty ?? "1",
        unitPrice: item.unitPrice,
        taxRate: item.taxRate ?? "0",
        lineTotal: paiseToDecimal(computeLineTotalPaise(money)),
      };
    });
  }, [items]);

  const secondaryDate = type === "quotation" ? validUntil : dueDate;

  return (
    <DocumentPreviewCard
      type={type}
      variant="live"
      org={org}
      accentTheme={accentTheme}
      documentNumber={documentNumber?.trim() || "Number on save"}
      billTo={
        client
          ? clientToBillTo(client)
          : { name: "Select client" }
      }
      issueDate={issueDate ?? new Date().toISOString().slice(0, 10)}
      secondaryDate={secondaryDate}
      taxMode={taxMode}
      items={previewItems}
      subtotal={formatINR(totals.subtotalPaise)}
      taxTotal={formatINR(totals.taxTotalPaise)}
      total={formatINR(totals.totalPaise)}
      notes={notes}
      terms={terms}
    />
  );
}
