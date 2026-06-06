import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back to FlexHub
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
