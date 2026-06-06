"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClientAction } from "@/actions/clients";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { INDIAN_STATES } from "@/lib/indian-states";
import { clientSchema, type ClientInput } from "@/lib/validations/client";

export type QuickAddedClient = {
  id: string;
  name: string;
  state_code: string;
  company: string | null;
  billing_address: string | null;
  gstin: string | null;
  phone: string | null;
  email: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStateCode?: string;
  onCreated: (client: QuickAddedClient) => void;
};

function toQuickAddedClient(id: string, values: ClientInput): QuickAddedClient {
  return {
    id,
    name: values.name,
    state_code: values.stateCode,
    company: values.company?.trim() || null,
    billing_address: values.billingAddress?.trim() || null,
    gstin: values.gstin?.trim() || null,
    phone: values.phone?.trim() || null,
    email: values.email?.trim() || null,
  };
}

export function ClientQuickAddDialog({
  open,
  onOpenChange,
  defaultStateCode = "24",
  onCreated,
}: Props) {
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
      stateCode: defaultStateCode,
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: "",
      email: "",
      phone: "",
      company: "",
      billingAddress: "",
      gstin: "",
      stateCode: defaultStateCode,
      notes: "",
    });
  }, [open, defaultStateCode, form]);

  async function onSubmit(values: ClientInput) {
    setPending(true);
    const result = await createClientAction(values);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const newId = result.data?.id;
    if (!newId) {
      toast.error("Client created but could not select it");
      return;
    }

    toast.success("Client added");
    onCreated(toQuickAddedClient(newId, values));
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add client"
      description="Save contact details — you can edit them later from Clients."
    >
      <div
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          const tag = (e.target as HTMLElement).tagName;
          if (tag === "TEXTAREA") return;
          e.preventDefault();
          void form.handleSubmit(onSubmit)();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="quick-client-name">Name *</Label>
          <Input
            id="quick-client-name"
            {...form.register("name")}
            placeholder="Client or contact name"
            autoFocus
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quick-client-email">Email</Label>
            <Input
              id="quick-client-email"
              type="email"
              {...form.register("email")}
              placeholder="hello@client.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-client-phone">Phone</Label>
            <Input
              id="quick-client-phone"
              {...form.register("phone")}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quick-client-company">Company</Label>
          <Input id="quick-client-company" {...form.register("company")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quick-client-address">Billing address</Label>
          <Textarea
            id="quick-client-address"
            {...form.register("billingAddress")}
            rows={2}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quick-client-gstin">GSTIN</Label>
            <Input
              id="quick-client-gstin"
              {...form.register("gstin")}
              placeholder="Optional"
            />
            {form.formState.errors.gstin ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.gstin.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-client-state">State *</Label>
            <Select id="quick-client-state" {...form.register("stateCode")}>
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="min-w-[120px] rounded-lg"
            disabled={pending}
            onClick={() => void form.handleSubmit(onSubmit)()}
          >
            {pending ? "Saving…" : "Add client"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
