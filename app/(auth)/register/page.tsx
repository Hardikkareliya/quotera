import Link from "next/link";

import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { RegisterForm } from "@/components/auth/register-form";
import { ui } from "@/lib/colors";
import { LAUNCH_PROMO_CODE, LAUNCH_PROMO_LABEL } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthFormHeader
        title="Create account"
        subtitle="Join early access and start managing clients, quotes, and invoices."
      />

      <div className={ui.promoBox}>
        <p className={cn("text-[12px] leading-relaxed", ui.muted)}>
          Use code{" "}
          <span className={ui.promoBadge}>
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
