"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitEarlyAccessAction } from "@/actions/early-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ui } from "@/lib/colors";
import {
  businessTypeOptions,
  EARLY_ACCESS_FORM,
  monthlyBudgetOptions,
} from "@/lib/landing-content";
import {
  earlyAccessSchema,
  type EarlyAccessFormValues,
} from "@/lib/validations/early-access";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onSuccess?: () => void;
  compact?: boolean;
};

const defaultValues: EarlyAccessFormValues = {
  fullName: "",
  email: "",
  phone: "",
  businessType: "",
  businessTypeOther: "",
  currentWorkflow: "",
  needsNotes: "",
  monthlyBudget: "",
};

export function EarlyAccessForm({ className, onSuccess, compact }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const form = useForm<EarlyAccessFormValues>({
    resolver: zodResolver(earlyAccessSchema),
    defaultValues,
  });

  const businessType = form.watch("businessType");

  async function onSubmit(values: EarlyAccessFormValues) {
    setPending(true);
    try {
      const result = await submitEarlyAccessAction(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
      onSuccess?.();
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-[16px] border border-primary/15 bg-secondary px-5 py-6 text-center",
          className,
        )}
      >
        <p className="font-[family-name:var(--font-outfit)] text-xl font-bold text-foreground">
          {EARLY_ACCESS_FORM.successTitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {EARLY_ACCESS_FORM.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
    >
      {!compact ? (
        <div>
          <p className="font-[family-name:var(--font-outfit)] text-xl font-bold text-[var(--qt-ink)]">
            {EARLY_ACCESS_FORM.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--qt-muted)]">
            {EARLY_ACCESS_FORM.subtitle}
          </p>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="ea-name">Full name</Label>
        <Input
          id="ea-name"
          autoComplete="name"
          placeholder="Your name"
          className={ui.fieldInput}
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ea-phone">WhatsApp number</Label>
        <div className="flex gap-2">
          <span className="inline-flex h-11 items-center rounded-xl border border-border bg-secondary px-3 text-sm text-muted-foreground">
            +91
          </span>
          <Input
            id="ea-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            className={cn(ui.fieldInput, "flex-1")}
            {...form.register("phone")}
          />
        </div>
        {form.formState.errors.phone ? (
          <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ea-email">Email</Label>
        <Input
          id="ea-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className={ui.fieldInput}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ea-business">Business type</Label>
        <Select id="ea-business" className={ui.fieldInput} {...form.register("businessType")}>
          <option value="" disabled>
            Select one
          </option>
          {businessTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        {form.formState.errors.businessType ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.businessType.message}
          </p>
        ) : null}
      </div>

      {businessType === "other" ? (
        <div className="grid gap-2">
          <Label htmlFor="ea-business-other">{EARLY_ACCESS_FORM.labels.businessTypeOther}</Label>
          <Input
            id="ea-business-other"
            placeholder="e.g. Interior design studio"
            className={ui.fieldInput}
            {...form.register("businessTypeOther")}
          />
          {form.formState.errors.businessTypeOther ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.businessTypeOther.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="ea-workflow">
          {EARLY_ACCESS_FORM.labels.currentWorkflow}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="ea-workflow"
          rows={3}
          placeholder={EARLY_ACCESS_FORM.hints.currentWorkflow}
          className={ui.fieldInput}
          {...form.register("currentWorkflow")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ea-needs">
          {EARLY_ACCESS_FORM.labels.needsNotes}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="ea-needs"
          rows={3}
          placeholder={EARLY_ACCESS_FORM.hints.needsNotes}
          className={ui.fieldInput}
          {...form.register("needsNotes")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ea-budget">{EARLY_ACCESS_FORM.labels.monthlyBudget}</Label>
        <Select id="ea-budget" className={ui.fieldInput} {...form.register("monthlyBudget")}>
          <option value="" disabled>
            Select a range
          </option>
          {monthlyBudgetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        {form.formState.errors.monthlyBudget ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.monthlyBudget.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="h-12 w-full rounded-[10px] text-base" disabled={pending}>
        {pending ? "Submitting…" : EARLY_ACCESS_FORM.submitLabel}
      </Button>

      <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
        No spam. We only use this to contact you about early access.
      </p>
    </form>
  );
}
