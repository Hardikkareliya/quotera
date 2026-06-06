"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createPaymentAction } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { paymentSchema, type PaymentInput } from "@/lib/validations/invoice";

export function PaymentForm({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId,
      amount: "",
      method: "upi",
      paidAt: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  async function onSubmit(values: PaymentInput) {
    setPending(true);
    const result = await createPaymentAction(values);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Payment recorded");
    form.reset({
      invoiceId,
      amount: "",
      method: "upi",
      paidAt: new Date().toISOString().slice(0, 10),
      note: "",
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...form.register("invoiceId")} />
      <div className="grid gap-2">
        <Label>Amount (₹)</Label>
        <Input {...form.register("amount")} />
      </div>
      <div className="grid gap-2">
        <Label>Method</Label>
        <Select {...form.register("method")}>
          <option value="upi">UPI</option>
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Date</Label>
        <Input type="date" {...form.register("paidAt")} />
      </div>
      <Button type="submit" className="w-full rounded-lg" disabled={pending}>
        {pending ? "Saving…" : "Add payment"}
      </Button>
    </form>
  );
}
