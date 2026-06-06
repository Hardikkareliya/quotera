import Link from "next/link";

import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { LoginForm } from "@/components/auth/login-form";
import { APP_NAME } from "@/lib/app-brand";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthFormHeader
        title="Sign in"
        subtitle={`Welcome back to ${APP_NAME}. Continue managing your business.`}
      />
      <LoginForm />
      <p className="border-t border-border/70 pt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
