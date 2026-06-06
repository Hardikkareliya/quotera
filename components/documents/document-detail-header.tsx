import type { ReactNode } from "react";

import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/format";

type Props = {
  number: string;
  clientName: string;
  total: string;
  subtitle?: ReactNode;
  status: string;
};

export function DocumentDetailHeader({
  number,
  clientName,
  total,
  subtitle,
  status,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{clientName}</p>
          <h2 className="mt-0.5 text-xl font-semibold text-foreground">{number}</h2>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {formatMoney(total)}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
