import type { ActionResult } from "@/lib/action-result";

/** Props passed from server pages so client bundles use fresh server action IDs. */
export type DocumentFormActions = {
  createQuotation: (input: unknown) => Promise<ActionResult<{ id: string }>>;
  updateQuotation: (
    id: string,
    input: unknown,
  ) => Promise<ActionResult<void>>;
  createInvoice: (input: unknown) => Promise<ActionResult<{ id: string }>>;
  updateInvoice: (id: string, input: unknown) => Promise<ActionResult<void>>;
};
