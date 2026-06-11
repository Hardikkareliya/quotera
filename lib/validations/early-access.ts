import { z } from "zod";

import {
  BUSINESS_TYPE_VALUES,
  MONTHLY_BUDGET_VALUES,
} from "@/lib/landing-content";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const earlyAccessSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your name").max(120),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    businessType: z
      .string()
      .min(1, "Select your business type")
      .pipe(z.enum(BUSINESS_TYPE_VALUES)),
    businessTypeOther: optionalText(120),
    currentWorkflow: optionalText(500),
    needsNotes: optionalText(500),
    monthlyBudget: z
      .string()
      .min(1, "Select what you can afford monthly")
      .pipe(z.enum(MONTHLY_BUDGET_VALUES)),
  })
  .superRefine((data, ctx) => {
    if (data.businessType === "other" && !data.businessTypeOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["businessTypeOther"],
        message: "Please specify your business type",
      });
    }
  });

export type EarlyAccessFormValues = z.input<typeof earlyAccessSchema>;
export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;
