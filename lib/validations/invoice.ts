import { z } from "zod";

import { TAX_MODES } from "@/lib/tax-mode";
import { documentItemsSchema } from "@/lib/validations/line-item";

export const invoiceSchema = z.object({
  clientId: z.string().uuid(),
  quotationId: z.string().uuid().optional().or(z.literal("")),
  issueDate: z.string().min(1),
  dueDate: z.string().optional().or(z.literal("")),
  taxMode: z.enum(TAX_MODES).default("none"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  terms: z.string().max(2000).optional().or(z.literal("")),
  items: documentItemsSchema,
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.string().min(1, "Amount required"),
  method: z.enum([
    "cash",
    "upi",
    "bank_transfer",
    "cheque",
    "card",
    "other",
  ]),
  paidAt: z.string().min(1),
  note: z.string().max(500).optional().or(z.literal("")),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
