import type { DocumentVisibility } from "@/lib/document-visibility";
import { parseDocumentVisibility } from "@/lib/document-visibility";
import type { Organization } from "@/types/database";

/** Display website without protocol for PDF/email. */
export function displayWebsite(website: string | null | undefined): string | null {
  if (!website?.trim()) return null;
  return website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function orgContactLines(
  org: Organization,
  visibility?: DocumentVisibility,
): string[] {
  const v = visibility ?? parseDocumentVisibility(org.document_visibility);
  const lines: string[] = [];
  if (v.email && org.email?.trim()) lines.push(`Email: ${org.email.trim()}`);
  if (v.phone && org.phone?.trim()) lines.push(`Phone: ${org.phone.trim()}`);
  const site = displayWebsite(org.website);
  if (v.website && site) lines.push(`Web: ${site}`);
  return lines;
}

export function orgTaxLines(
  org: Organization,
  visibility?: DocumentVisibility,
): string[] {
  const v = visibility ?? parseDocumentVisibility(org.document_visibility);
  const lines: string[] = [];
  if (v.gstin && org.gstin?.trim()) lines.push(`GSTIN: ${org.gstin.trim()}`);
  if (v.pan && org.pan?.trim()) lines.push(`PAN: ${org.pan.trim().toUpperCase()}`);
  return lines;
}

export function orgBankLines(org: Organization): string[] {
  if (!org.bank_name?.trim() && !org.bank_account?.trim()) return [];
  const lines: string[] = ["Bank details:"];
  if (org.bank_name?.trim()) lines.push(org.bank_name.trim());
  if (org.bank_account?.trim()) lines.push(`A/C: ${org.bank_account.trim()}`);
  if (org.bank_ifsc?.trim()) lines.push(`IFSC: ${org.bank_ifsc.trim().toUpperCase()}`);
  return lines;
}
