"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  LineItemsEditor,
  type LineItemsFormValues,
} from "@/components/documents/line-items-editor";
import { DocumentLivePreview } from "@/components/documents/document-live-preview";
import { TaxModeSelector } from "@/components/documents/tax-mode-selector";
import { FormFooter } from "@/components/layout/form-footer";
import { FormSection } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentFormActions } from "@/lib/document-form-actions";
import {
  defaultTaxModeForOrg,
  isTaxEnabled,
  TAX_MODES,
  type TaxMode,
} from "@/lib/tax-mode";
import type { DocumentThemeTokens } from "@/lib/document-theme";
import { documentItemsSchema } from "@/lib/validations/line-item";
import type { Client, Organization } from "@/types/database";

const baseSchema = z.object({
  clientId: z.string().uuid(),
  issueDate: z.string().min(1),
  validUntil: z.string().optional(),
  dueDate: z.string().optional(),
  taxMode: z.enum(TAX_MODES),
  notes: z.string().optional(),
  terms: z.string().optional(),
  quotationId: z.string().optional(),
  items: documentItemsSchema,
});

type FormValues = z.infer<typeof baseSchema>;

type Props = {
  type: "quotation" | "invoice";
  clients: Pick<Client, "id" | "name" | "state_code">[];
  org: Organization;
  accentTheme: DocumentThemeTokens;
  /** When true, new documents default to GST instead of None. */
  hasOrgGstin?: boolean;
  /** full = side preview (create). simple = single column (edit on detail page). */
  layout?: "full" | "simple";
  documentId?: string;
  documentNumber?: string | null;
  defaultValues?: Partial<FormValues>;
  cancelHref: string;
  listHref: string;
  actions: DocumentFormActions;
};

export function DocumentForm({
  type,
  clients,
  org,
  accentTheme,
  hasOrgGstin = false,
  layout = "full",
  documentId,
  documentNumber,
  defaultValues,
  cancelHref,
  listHref,
  actions,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const basePath = type === "quotation" ? "/quotations" : "/invoices";
  const showPreview = layout === "full";

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      issueDate: new Date().toISOString().slice(0, 10),
      validUntil: "",
      dueDate: "",
      taxMode: defaultTaxModeForOrg(hasOrgGstin),
      notes: "",
      terms: "",
      items: [
        {
          description: "",
          subDescription: "",
          hsnSac: "",
          pricingMode: "qty_rate",
          qty: "1",
          unitPrice: "0",
          taxRate: hasOrgGstin ? "18" : "0",
        },
      ],
      ...defaultValues,
    },
  });

  const taxMode = form.watch("taxMode");
  const taxEnabled = isTaxEnabled(taxMode);

  function handleTaxModeChange(mode: TaxMode) {
    form.setValue("taxMode", mode, { shouldDirty: true });
    if (!isTaxEnabled(mode)) {
      const items = form.getValues("items");
      items.forEach((_, index) => {
        form.setValue(`items.${index}.taxRate`, "0");
      });
    }
  }

  async function onSubmit(values: FormValues) {
    setPending(true);
    let result;

    if (type === "quotation") {
      const payload = {
        clientId: values.clientId,
        issueDate: values.issueDate,
        validUntil: values.validUntil ?? "",
        taxMode: values.taxMode,
        notes: values.notes ?? "",
        terms: values.terms ?? "",
        items: values.items,
      };
      result = documentId
        ? await actions.updateQuotation(documentId, payload)
        : await actions.createQuotation(payload);
    } else {
      const payload = {
        clientId: values.clientId,
        quotationId: values.quotationId ?? "",
        issueDate: values.issueDate,
        dueDate: values.dueDate ?? "",
        taxMode: values.taxMode,
        notes: values.notes ?? "",
        terms: values.terms ?? "",
        items: values.items,
      };
      result = documentId
        ? await actions.updateInvoice(documentId, payload)
        : await actions.createInvoice(payload);
    }

    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    if (documentId) {
      toast.success("Changes saved");
      router.replace(`${basePath}/${documentId}?saved=1`);
      router.refresh();
      return;
    }

    const newId = result.data?.id;
    if (!newId) {
      toast.error("Created but could not open document");
      router.replace(listHref);
      return;
    }

    toast.success(type === "quotation" ? "Quotation created" : "Invoice created");
    router.replace(`${basePath}/${newId}?created=1`);
  }

  const label = type === "quotation" ? "quotation" : "invoice";

  const formBody = (
    <div className="min-w-0 space-y-5">
      <FormSection title="Details" description={`Client and dates for this ${label}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Client *</Label>
            <Select {...form.register("clientId")}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Issue date *</Label>
            <Input type="date" {...form.register("issueDate")} />
          </div>
          {type === "quotation" ? (
            <div className="grid gap-2">
              <Label>Valid until</Label>
              <Input type="date" {...form.register("validUntil")} />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>Due date</Label>
              <Input type="date" {...form.register("dueDate")} />
            </div>
          )}
          <div className="grid gap-2 sm:col-span-2">
            <Label>Tax type</Label>
            <TaxModeSelector value={taxMode} onChange={handleTaxModeChange} />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Line items"
        description={
          taxEnabled
            ? "Add services or products — set tax % on each line"
            : "Add services or products — no tax on this document"
        }
      >
        <LineItemsEditor
          control={form.control as unknown as Control<LineItemsFormValues>}
          register={
            form.register as unknown as UseFormRegister<LineItemsFormValues>
          }
          setValue={
            form.setValue as unknown as UseFormSetValue<LineItemsFormValues>
          }
          taxEnabled={taxEnabled}
        />
      </FormSection>

      <FormSection title="Notes & terms" description="Shown on PDF">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Notes</Label>
            <Textarea {...form.register("notes")} rows={4} />
          </div>
          <div className="grid gap-2">
            <Label>Terms</Label>
            <Textarea {...form.register("terms")} rows={4} />
          </div>
        </div>
        <FormFooter
          cancelHref={cancelHref}
          submitLabel={documentId ? "Save changes" : `Create ${label}`}
          pending={pending}
        />
      </FormSection>
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {showPreview ? (
        <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,22rem)] xl:grid-cols-[minmax(0,1fr)_24rem]">
          {formBody}
          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <DocumentLivePreview
              type={type}
              control={form.control as unknown as Control<Record<string, unknown>>}
              clients={clients}
              org={org}
              accentTheme={accentTheme}
              documentNumber={documentNumber}
            />
          </aside>
        </div>
      ) : (
        formBody
      )}
    </form>
  );
}
