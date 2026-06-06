import { z } from "zod";

import { TAX_MODES } from "@/lib/tax-mode";
import { documentItemsSchema } from "@/lib/validations/line-item";

export const quotationSchema = z.object({
  clientId: z.string().uuid(),
  issueDate: z.string().min(1),
  validUntil: z.string().optional().or(z.literal("")),
  taxMode: z.enum(TAX_MODES).default("none"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  terms: z.string().max(2000).optional().or(z.literal("")),
  items: documentItemsSchema,
});

export type QuotationInput = z.infer<typeof quotationSchema>;
