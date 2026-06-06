"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClientAction, updateClientAction } from "@/actions/clients";
import { FormFooter } from "@/components/layout/form-footer";
import { FormSection } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INDIAN_STATES } from "@/lib/indian-states";
import { clientSchema, type ClientInput } from "@/lib/validations/client";

type Props = {
  clientId?: string;
  defaultValues?: Partial<ClientInput>;
  cancelHref: string;
};

export function ClientForm({ clientId, defaultValues, cancelHref }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      billingAddress: "",
      gstin: "",
      stateCode: "24",
      notes: "",
      ...defaultValues,
    },
  });

  async function onSubmit(values: ClientInput) {
    setPending(true);
    const result = clientId
      ? await updateClientAction(clientId, values)
      : await createClientAction(values);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    if (clientId) {
      toast.success("Client updated");
      router.refresh();
      return;
    }

    const newId = result.data?.id;
    if (!newId) {
      toast.error("Created but could not open client");
      router.replace("/clients");
      return;
    }

    toast.success("Client created");
    router.replace(`/clients/${newId}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection title="Client information" description="Contact and billing details">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Name *</Label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input {...form.register("phone")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Company</Label>
            <Input {...form.register("company")} />
          </div>
          <div className="grid gap-2">
            <Label>Billing address</Label>
            <Textarea {...form.register("billingAddress")} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>GSTIN</Label>
              <Input {...form.register("gstin")} placeholder="Optional" />
            </div>
            <div className="grid gap-2">
              <Label>State *</Label>
              <Select {...form.register("stateCode")}>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={3} />
          </div>
        </div>
        <FormFooter
          cancelHref={cancelHref}
          submitLabel={clientId ? "Save changes" : "Create client"}
          pending={pending}
        />
      </FormSection>
    </form>
  );
}
