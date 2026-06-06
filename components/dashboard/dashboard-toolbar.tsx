import Link from "next/link";
import { FileText, Plus, UserPlus } from "lucide-react";

import { PeriodControls } from "@/components/dashboard/period-controls";
import { Button } from "@/components/ui/button";
import type { DashboardPeriod } from "@/lib/dashboard-period";

type Props = {
  period: DashboardPeriod;
};

export function DashboardToolbar({ period }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
        <div className="border-b border-border p-4 md:p-5 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter by period
          </p>
          <PeriodControls period={period} />
        </div>

        <div className="p-4 md:p-5 lg:min-w-[220px]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick actions
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="h-10 w-full justify-center rounded-lg">
              <Link href="/invoices/new">
                <Plus className="size-4" />
                New invoice
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 w-full justify-center rounded-lg"
            >
              <Link href="/quotations/new">
                <FileText className="size-4" />
                New quotation
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 w-full justify-center rounded-lg"
            >
              <Link href="/clients/new">
                <UserPlus className="size-4" />
                Add client
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
