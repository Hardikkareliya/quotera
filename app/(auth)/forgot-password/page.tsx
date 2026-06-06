import Link from "next/link";

import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <AuthFormHeader
        title="Reset password"
        subtitle="Enter your email and we'll send you a secure reset link."
      />
      <ForgotPasswordForm />
      <p className="border-t border-border/70 pt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
