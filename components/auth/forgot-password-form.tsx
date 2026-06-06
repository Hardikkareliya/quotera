"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setPending(true);
    const result = await forgotPasswordAction(values);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setSent(true);
    toast.success("Check your email for a reset link");
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        If an account exists for that email, we sent a reset link.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          className="h-11 rounded-xl border-[#1a3d34]/15 bg-[#fcfaf6] px-4"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-[15px] font-semibold shadow-[0_12px_28px_rgb(26_61_52/0.18)]"
        disabled={pending}
      >
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
