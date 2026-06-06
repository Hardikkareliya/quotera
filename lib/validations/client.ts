import { z } from "zod";

import { GSTIN_REGEX, normalizeGstin } from "@/lib/gstin";

export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  billingAddress: z.string().max(500).optional().or(z.literal("")),
  gstin: z
    .string()
    .transform((v) => normalizeGstin(v))
    .refine((v) => !v || GSTIN_REGEX.test(v), {
      message: "Invalid GSTIN (15 characters, e.g. 24AABCS1429Q1Z5)",
    }),
  stateCode: z.string().length(2, "Select a state"),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;
