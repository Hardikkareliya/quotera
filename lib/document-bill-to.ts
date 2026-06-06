export type DocumentBillToInfo = {
  name: string;
  company?: string | null;
  billingAddress?: string | null;
  gstin?: string | null;
  stateCode?: string | null;
  phone?: string | null;
  email?: string | null;
};

type ClientLike = {
  name: string;
  company?: string | null;
  billing_address?: string | null;
  gstin?: string | null;
  state_code?: string | null;
  phone?: string | null;
  email?: string | null;
};

export function clientToBillTo(client: ClientLike): DocumentBillToInfo {
  return {
    name: client.name,
    company: client.company,
    billingAddress: client.billing_address,
    gstin: client.gstin,
    stateCode: client.state_code,
    phone: client.phone,
    email: client.email,
  };
}

/** Address, GSTIN, contact — shown under the client name. */
export function buildBillToDetailLines(billTo: DocumentBillToInfo): string[] {
  const lines: string[] = [];

  if (billTo.company?.trim()) {
    lines.push(billTo.company.trim());
  }

  if (billTo.billingAddress?.trim()) {
    for (const part of billTo.billingAddress.split("\n")) {
      const trimmed = part.trim();
      if (trimmed) lines.push(trimmed);
    }
  }

  if (billTo.gstin?.trim()) {
    lines.push(`GSTIN: ${billTo.gstin.trim()}`);
  }

  const phone = billTo.phone?.trim();
  const email = billTo.email?.trim();
  if (phone && email) {
    lines.push(`${phone} · ${email}`);
  } else if (phone) {
    lines.push(phone);
  } else if (email) {
    lines.push(email);
  }

  return lines;
}
