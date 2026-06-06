import Link from "next/link";

import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { RegisterForm } from "@/components/auth/register-form";
import { LAUNCH_PROMO_CODE, LAUNCH_PROMO_LABEL } from "@/lib/landing-content";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthFormHeader
        title="Create account"
        subtitle="Join early access and start managing clients, quotes, and invoices."
      />

      <div className="rounded-[14px] border border-[#1a3d34]/10 bg-[#f8f4ec] px-4 py-3">
        <p className="text-[12px] leading-relaxed text-[#5c6e66]">
          Use code{" "}
          <span className="rounded-md bg-[#1a3d34] px-1.5 py-0.5 font-bold text-[#f2ebe0]">
            {LAUNCH_PROMO_CODE}
          </span>{" "}
          for {LAUNCH_PROMO_LABEL}.
        </p>
      </div>

      <RegisterForm />

      <p className="border-t border-border/70 pt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
