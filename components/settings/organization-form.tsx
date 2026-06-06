"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateOrganizationAction, uploadOrgAssetAction } from "@/actions/organization";
import { DocumentAccentPreview, themeFromFormValues } from "@/components/settings/document-accent-preview";
import { DocumentThemePicker } from "@/components/settings/document-theme-picker";
import { DocumentVisibilityToggles } from "@/components/settings/document-visibility-toggles";
import { FormFooter } from "@/components/layout/form-footer";
import { FormSection } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  enabledVisibilityLabels,
  parseDocumentVisibility,
} from "@/lib/document-visibility";
import {
  DEFAULT_CUSTOM_ACCENT,
  normalizeHexColor,
  parseStoredDocumentTheme,
} from "@/lib/document-theme";
import { INDIAN_STATES } from "@/lib/indian-states";
import { displayWebsite } from "@/lib/org-display";
import {
  organizationSchema,
  type OrganizationInput,
} from "@/lib/validations/organization";
import type { Organization } from "@/types/database";

export function OrganizationForm({ org }: { org: Organization }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const defaultValues: OrganizationInput = {
    name: org.name,
    gstin: org.gstin ?? "",
    pan: org.pan ?? "",
    address: org.address ?? "",
    stateCode: org.state_code,
    email: org.email ?? "",
    phone: org.phone ?? "",
    website: displayWebsite(org.website) ?? "",
    bankName: org.bank_name ?? "",
    bankAccount: org.bank_account ?? "",
    bankIfsc: org.bank_ifsc ?? "",
    invoicePrefix: org.invoice_prefix,
    quotePrefix: org.quote_prefix,
    documentVisibility: parseDocumentVisibility(org.document_visibility),
    documentTheme: parseStoredDocumentTheme(org.document_theme),
    documentAccentCustom:
      normalizeHexColor(org.document_accent_custom) ?? DEFAULT_CUSTOM_ACCENT,
  };

  const form = useForm<OrganizationInput>({
    resolver: zodResolver(organizationSchema),
    defaultValues,
  });

  const visibility = form.watch("documentVisibility");
  const documentTheme = form.watch("documentTheme");
  const documentAccentCustom = form.watch("documentAccentCustom");
  const previewTheme = themeFromFormValues(documentTheme, documentAccentCustom);

  useEffect(() => {
    form.reset(defaultValues);
  }, [org.updated_at, org.id]);

  async function onSubmit(values: OrganizationInput) {
    setPending(true);
    const result = await updateOrganizationAction(values);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Company profile saved");
    router.refresh();
  }

  async function uploadAsset(field: "logo" | "signature" | "payment_qr", file: File) {
    const fd = new FormData();
    fd.set("field", field);
    fd.set("file", file);
    const result = await uploadOrgAssetAction(fd);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Image saved");
    router.refresh();
  }

  function setVisibility(
    key: keyof OrganizationInput["documentVisibility"],
    enabled: boolean,
  ) {
    form.setValue(`documentVisibility.${key}`, enabled, { shouldDirty: true });
  }

  const enabledLabels = enabledVisibilityLabels(visibility);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Company details for quotations and invoices. Choose an accent colour and
        tick which fields appear on the document.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormSection
          title="Document colour"
          description="Accent used on quotation and invoice heading, total, and top bar"
        >
          <DocumentThemePicker
            theme={form.watch("documentTheme")}
            customAccent={form.watch("documentAccentCustom") ?? ""}
            onThemeChange={(id) =>
              form.setValue("documentTheme", id, { shouldDirty: true })
            }
            onCustomAccentChange={(hex) =>
              form.setValue("documentAccentCustom", hex, { shouldDirty: true })
            }
          />
          {form.formState.errors.documentAccentCustom ? (
            <p className="mt-2 text-sm text-destructive">
              {form.formState.errors.documentAccentCustom.message}
            </p>
          ) : null}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Live colour preview
            </p>
            <DocumentAccentPreview theme={previewTheme} />
          </div>
        </FormSection>

        <FormSection
          title="Company"
          description="Name and address — company name always appears"
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="org-name">Company name *</Label>
              <Input id="org-name" {...form.register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-address">Address</Label>
              <Textarea id="org-address" {...form.register("address")} rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-state">State *</Label>
              <Select id="org-state" {...form.register("stateCode")}>
                {INDIAN_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <DocumentVisibilityToggles
              keys={["address", "state"]}
              values={visibility}
              onChange={setVisibility}
            />
          </div>
        </FormSection>

        <FormSection
          title="Contact"
          description="How clients can reach you"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="org-email">Email</Label>
              <Input
                id="org-email"
                type="email"
                {...form.register("email")}
                placeholder="hello@yourcompany.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-phone">Phone</Label>
              <Input
                id="org-phone"
                {...form.register("phone")}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                {...form.register("website")}
                placeholder="www.yourcompany.com"
              />
            </div>
          </div>
          <DocumentVisibilityToggles
            keys={["email", "phone", "website"]}
            values={visibility}
            onChange={setVisibility}
            className="mt-4"
          />
        </FormSection>

        <FormSection
          title="Tax IDs"
          description="Optional — for GST-registered businesses"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="org-gstin">GSTIN</Label>
              <Input
                id="org-gstin"
                {...form.register("gstin")}
                placeholder="24AABCS1429Q1Z5"
                autoCapitalize="characters"
                spellCheck={false}
              />
              {form.formState.errors.gstin ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.gstin.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  15 characters; spaces and lowercase are OK
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="org-pan">PAN</Label>
              <Input
                id="org-pan"
                {...form.register("pan")}
                placeholder="ABCDE1234F"
                autoCapitalize="characters"
              />
              {form.formState.errors.pan ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.pan.message}
                </p>
              ) : null}
            </div>
          </div>
          <DocumentVisibilityToggles
            keys={["gstin", "pan"]}
            values={visibility}
            onChange={setVisibility}
            className="mt-4"
          />
        </FormSection>

        <FormSection
          title="Bank details"
          description="Shown on invoices when enabled — helps clients pay you"
        >
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="org-bank">Bank name</Label>
              <Input id="org-bank" {...form.register("bankName")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="org-account">Account number</Label>
                <Input id="org-account" {...form.register("bankAccount")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="org-ifsc">IFSC</Label>
                <Input id="org-ifsc" {...form.register("bankIfsc")} />
              </div>
            </div>
          </div>
          <DocumentVisibilityToggles
            keys={["bank"]}
            values={visibility}
            onChange={setVisibility}
            className="mt-4"
          />
        </FormSection>

        <FormSection
          title="Document numbering"
          description="Internal — not shown on PDF header"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="inv-prefix">Invoice prefix</Label>
              <Input id="inv-prefix" {...form.register("invoicePrefix")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qt-prefix">Quote prefix</Label>
              <Input id="qt-prefix" {...form.register("quotePrefix")} />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Images"
          description="Upload instantly — checkboxes control PDF visibility"
        >
          <div className="space-y-4">
            {(
              [
                ["logo", "Company logo", org.logo_url, "logo" as const],
                ["signature", "Signature", org.signature_url, "signature" as const],
                [
                  "payment_qr",
                  "UPI / payment QR",
                  org.payment_qr_url,
                  "payment_qr" as const,
                ],
              ] as const
            ).map(([field, label, url, visibilityKey]) => (
              <div
                key={field}
                className="rounded-lg border border-border bg-muted/20 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={label}
                        className="mt-2 h-14 max-w-[200px] object-contain"
                      />
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Not added yet
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <Label className="sr-only">Upload {label}</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-[220px] text-sm"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadAsset(field, f);
                      }}
                    />
                  </div>
                </div>
                <DocumentVisibilityToggles
                  keys={[visibilityKey]}
                  values={visibility}
                  onChange={setVisibility}
                  className="mt-3"
                />
                {visibilityKey !== "logo" ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {visibilityKey === "signature"
                      ? "Signature appears on invoices only."
                      : "Payment QR appears on invoices only."}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </FormSection>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card md:p-5">
          {enabledLabels.length > 0 ? (
            <p className="mb-3 text-xs text-muted-foreground">
              Visible on document: {enabledLabels.join(", ")}
            </p>
          ) : null}
          <p className="mb-4 text-sm text-muted-foreground">
            Saves company info, document colour, visibility, and numbering.
          </p>
          <FormFooter
            cancelHref="/dashboard?period=month"
            submitLabel="Save company profile"
            pending={pending}
          />
        </div>
      </form>
    </div>
  );
}
