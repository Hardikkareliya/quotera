export function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export function quotationShareText(params: {
  number: string;
  total: string;
  companyName: string;
}): string {
  return `Hi! Please find quotation ${params.number} from ${params.companyName} for ₹${params.total}. Thank you!`;
}

export function invoiceShareText(params: {
  number: string;
  total: string;
  companyName: string;
}): string {
  return `Hi! Please find invoice ${params.number} from ${params.companyName} for ₹${params.total}. Thank you!`;
}
