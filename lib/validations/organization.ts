import { z } from "zod";

import { DOCUMENT_VISIBILITY_KEYS } from "@/lib/document-visibility";
import {
  DOCUMENT_STORED_THEME_IDS,
  normalizeHexColor,
} from "@/lib/document-theme";
import { GSTIN_REGEX, normalizeGstin } from "@/lib/gstin";

const optionalText = (max: number) =>
  z.string().max(max).optional().or(z.literal(""));

const optionalEmail = z
  .string()
  .email("Invalid email")
  .max(200)
  .optional()
  .or(z.literal(""));

const optionalUrl = z
  .string()
  .max(300)
  .refine(
    (v) =>
      !v ||
      /^https?:\/\/.+/i.test(v) ||
      /^[a-z0-9][-a-z0-9.]*\.[a-z]{2,}/i.test(v),
    { message: "Enter a valid website (e.g. example.com)" },
  )
  .optional()
  .or(z.literal(""));

const optionalPan = z
  .string()
  .refine((v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase()), {
    message: "Invalid PAN format",
  })
  .optional()
  .or(z.literal(""));

export const organizationSchema = z.object({
  name: z.string().min(1, "Company name is required").max(200),
  gstin: z
    .string()
    .transform((v) => normalizeGstin(v))
    .refine((v) => !v || GSTIN_REGEX.test(v), {
      message: "Invalid GSTIN (15 characters, e.g. 24AABCS1429Q1Z5)",
    }),
  pan: optionalPan,
  address: optionalText(500),
  stateCode: z.string().length(2, "Select a state"),
  email: optionalEmail,
  phone: optionalText(20),
  website: optionalUrl,
  bankName: optionalText(120),
  bankAccount: optionalText(40),
  bankIfsc: z
    .string()
    .refine((v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()), {
      message: "Invalid IFSC format",
    })
    .optional()
    .or(z.literal("")),
  invoicePrefix: z.string().min(1).max(20),
  quotePrefix: z.string().min(1).max(20),
  documentVisibility: z.object(
    Object.fromEntries(
      DOCUMENT_VISIBILITY_KEYS.map((key) => [key, z.boolean()]),
    ) as Record<(typeof DOCUMENT_VISIBILITY_KEYS)[number], z.ZodBoolean>,
  ),
  documentTheme: z.enum(DOCUMENT_STORED_THEME_IDS),
  documentAccentCustom: z.string().max(7).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.documentTheme === "custom") {
    if (!normalizeHexColor(data.documentAccentCustom)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["documentAccentCustom"],
        message: "Enter a valid colour (e.g. #1a3d34)",
      });
    }
  }
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

export function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
