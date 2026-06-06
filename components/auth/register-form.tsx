"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterInput) {
    setPending(true);
    try {
      const result = await registerAction(values);
      if (result && !result.success) toast.error(result.error);
    } catch {
      // redirect
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          placeholder="Your name"
          className="h-11 rounded-xl border-[#1a3d34]/15 bg-[#fcfaf6] px-4"
          {...form.register("fullName")}
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-destructive">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>
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
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          className="h-11 rounded-xl border-[#1a3d34]/15 bg-[#fcfaf6] px-4"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="mt-1 h-12 w-full rounded-xl text-[15px] font-semibold shadow-[0_12px_28px_rgb(26_61_52/0.18)]"
        disabled={pending}
      >
        {pending ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}
