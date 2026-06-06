import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-card">
        F
      </div>
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          FlexHub
        </h1>
        <p className="mt-3 text-muted-foreground">
          Manage clients, quotations, invoices, and payments in one place.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline" className="rounded-xl px-8">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild className="rounded-xl px-8">
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </main>
  );
}
