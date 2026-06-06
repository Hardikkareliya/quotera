import Link from "next/link";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function OrgMissing() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[20px] bg-card p-10 text-center shadow-card">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building2 className="size-7" />
      </div>
      <h2 className="text-lg font-bold">Setting up your workspace</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your organization could not be loaded. Refresh the page or sign in
        again.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link href="/dashboard">Refresh dashboard</Link>
      </Button>
    </div>
  );
}
