import { z } from "zod";

export const lineItemSchema = z
  .object({
    description: z.string().min(1, "Description required"),
    subDescription: z.string().max(2000).optional().or(z.literal("")),
    hsnSac: z.string().max(20).optional().or(z.literal("")),
    pricingMode: z.enum(["qty_rate", "fixed"]),
    qty: z.string().optional().or(z.literal("")),
    unitPrice: z.string().min(1, "Amount required"),
    taxRate: z.string().optional().or(z.literal("")),
  })
  .superRefine((item, ctx) => {
    if (item.pricingMode === "qty_rate") {
      if (!item.qty?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity required",
          path: ["qty"],
        });
      }
    }
  });

export const documentItemsSchema = z
  .array(lineItemSchema)
  .min(1, "Add at least one line item");

export type LineItemFormInput = z.infer<typeof lineItemSchema>;
