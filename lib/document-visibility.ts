import { stateName } from "@/lib/indian-states";
import {
  displayWebsite,
  orgBankLines,
  orgContactLines,
  orgTaxLines,
} from "@/lib/org-display";
import type { Organization } from "@/types/database";

export const DOCUMENT_VISIBILITY_KEYS = [
  "address",
  "state",
  "email",
  "phone",
  "website",
  "gstin",
  "pan",
  "logo",
  "bank",
  "signature",
  "payment_qr",
] as const;

export type DocumentVisibilityKey = (typeof DOCUMENT_VISIBILITY_KEYS)[number];
export type DocumentVisibility = Record<DocumentVisibilityKey, boolean>;

export const DEFAULT_DOCUMENT_VISIBILITY: DocumentVisibility = {
  address: true,
  state: true,
  email: true,
  phone: true,
  website: true,
  gstin: true,
  pan: true,
  logo: true,
  bank: true,
  signature: true,
  payment_qr: true,
};

export const VISIBILITY_FIELD_META: Record<
  DocumentVisibilityKey,
  { label: string; hint: string; scope: "both" | "invoice" }
> = {
  address: {
    label: "Address",
    hint: "Quotation & invoice",
    scope: "both",
  },
  state: {
    label: "State",
    hint: "Quotation & invoice",
    scope: "both",
  },
  email: {
    label: "Email",
    hint: "Quotation & invoice",
    scope: "both",
  },
  phone: {
    label: "Phone",
    hint: "Quotation & invoice",
    scope: "both",
  },
  website: {
    label: "Website",
    hint: "Quotation & invoice",
    scope: "both",
  },
  gstin: {
    label: "GSTIN",
    hint: "Quotation & invoice",
    scope: "both",
  },
  pan: {
    label: "PAN",
    hint: "Quotation & invoice",
    scope: "both",
  },
  logo: {
    label: "Logo",
    hint: "Quotation & invoice",
    scope: "both",
  },
  bank: {
    label: "Bank details",
    hint: "Invoices only",
    scope: "invoice",
  },
  signature: {
    label: "Signature",
    hint: "Invoices only",
    scope: "invoice",
  },
  payment_qr: {
    label: "Payment QR",
    hint: "Invoices only",
    scope: "invoice",
  },
};

export function parseDocumentVisibility(raw: unknown): DocumentVisibility {
  const merged = { ...DEFAULT_DOCUMENT_VISIBILITY };
  if (!raw || typeof raw !== "object") return merged;
  for (const key of DOCUMENT_VISIBILITY_KEYS) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === "boolean") merged[key] = value;
  }
  return merged;
}

export type OrgDocumentHeader = {
  name: string;
  logoUrl: string | null;
  lines: string[];
  bankLines: string[];
  signatureUrl: string | null;
  paymentQrUrl: string | null;
};

export function buildOrgDocumentHeader(
  org: Organization,
  type: "quotation" | "invoice",
): OrgDocumentHeader {
  const visibility = parseDocumentVisibility(org.document_visibility);
  const lines: string[] = [];

  if (visibility.address && org.address?.trim()) {
    lines.push(org.address.trim());
  }
  if (visibility.state && org.state_code) {
    lines.push(`State: ${stateName(org.state_code)}`);
  }
  lines.push(...orgTaxLines(org, visibility));
  lines.push(...orgContactLines(org, visibility));

  const isInvoice = type === "invoice";

  return {
    name: org.name,
    logoUrl: visibility.logo && org.logo_url ? org.logo_url : null,
    lines,
    bankLines: isInvoice && visibility.bank ? orgBankLines(org) : [],
    signatureUrl:
      isInvoice && visibility.signature && org.signature_url
        ? org.signature_url
        : null,
    paymentQrUrl:
      isInvoice && visibility.payment_qr && org.payment_qr_url
        ? org.payment_qr_url
        : null,
  };
}

/** Plain labels for settings summary */
export function enabledVisibilityLabels(
  visibility: DocumentVisibility,
): string[] {
  return DOCUMENT_VISIBILITY_KEYS.filter((key) => visibility[key]).map(
    (key) => VISIBILITY_FIELD_META[key].label,
  );
}
