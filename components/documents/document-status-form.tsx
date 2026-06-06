"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { INVOICE_STATUSES, QUOTATION_STATUSES } from "@/lib/document-statuses";

type Props = {
  type: "quotation" | "invoice";
  id: string;
  currentStatus: string;
  updateQuotationStatus: (
    id: string,
    status: string,
  ) => Promise<ActionResult<void>>;
  updateInvoiceStatus: (
    id: string,
    status: string,
  ) => Promise<ActionResult<void>>;
};

export function DocumentStatusForm({
  type,
  id,
  currentStatus,
  updateQuotationStatus,
  updateInvoiceStatus,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, setPending] = useState(false);

  const options =
    type === "quotation" ? QUOTATION_STATUSES : INVOICE_STATUSES;

  async function handleUpdate() {
    setPending(true);
    const result =
      type === "quotation"
        ? await updateQuotationStatus(id, status)
        : await updateInvoiceStatus(id, status);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Status updated");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <p className="mb-3 text-sm font-semibold text-foreground">Status</p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid min-w-[200px] flex-1 gap-2">
          <Label htmlFor="doc-status" className="sr-only">
            Status
          </Label>
          <Select
            id="doc-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          disabled={pending || status === currentStatus}
          onClick={handleUpdate}
        >
          {pending ? "Updating…" : "Update status"}
        </Button>
      </div>
    </div>
  );
}
