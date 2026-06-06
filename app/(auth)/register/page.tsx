import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Start managing your business today
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
