import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Reset password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll email you a reset link
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
