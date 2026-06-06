"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileInput } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

type Props = {
  quotationId: string;
  convertAction: (
    quotationId: string,
  ) => Promise<ActionResult<{ id: string }>>;
};

export function ConvertToInvoiceButton({
  quotationId,
  convertAction,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleConvert() {
    setPending(true);
    const result = await convertAction(quotationId);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const invoiceId = result.data?.id;
    if (!invoiceId) {
      toast.error("Invoice created but could not open it");
      return;
    }

    toast.success("Invoice created from quotation");
    router.push(`/invoices/${invoiceId}?created=1`);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className="h-11 w-full gap-2 rounded-lg"
      disabled={pending}
      onClick={handleConvert}
    >
      <FileInput className="size-4" />
      {pending ? "Creating invoice…" : "Convert to invoice"}
    </Button>
  );
}
