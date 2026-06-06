"use client";

import Link, { useLinkStatus } from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  dashboardPeriodHref,
  getPeriodLabel,
  getPeriodScopeNote,
  PERIOD_OPTIONS,
  type DashboardPeriod,
} from "@/lib/dashboard-period";

function TabInner({
  label,
  shortLabel,
  isActive,
}: {
  label: string;
  shortLabel: string;
  isActive: boolean;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      {isActive ? <Check className="size-3.5 shrink-0" strokeWidth={2.5} /> : null}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
      {pending ? (
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/40">
          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </span>
      ) : null}
    </>
  );
}

function PeriodTab({
  period,
  label,
  shortLabel,
  isActive,
}: {
  period: DashboardPeriod;
  label: string;
  shortLabel: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={dashboardPeriodHref(period)}
      prefetch
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all sm:flex-none sm:min-w-[7.5rem]",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
          : "bg-card text-muted-foreground hover:bg-background hover:text-foreground",
      )}
    >
      <TabInner label={label} shortLabel={shortLabel} isActive={isActive} />
    </Link>
  );
}

type Props = {
  period: DashboardPeriod;
};

/** Props from server URL — no useSearchParams (avoids hydration mismatch). */
export function PeriodControls({ period }: Props) {
  const label = getPeriodLabel(period);
  const scopeNote = getPeriodScopeNote(period);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">Active range</p>
        <p className="mt-0.5 text-base font-semibold text-foreground">{label}</p>
      </div>

      <div
        className="grid grid-cols-4 gap-1.5 rounded-xl border border-border bg-muted/40 p-1.5 sm:inline-flex sm:gap-1"
        role="tablist"
        aria-label="Dashboard time period"
      >
        {PERIOD_OPTIONS.map(({ value, label: optionLabel, short }) => (
          <PeriodTab
            key={value}
            period={value}
            label={optionLabel}
            shortLabel={short}
            isActive={period === value}
          />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{scopeNote}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Outstanding</span> always
        shows all unpaid sent invoices (not limited by this filter).
      </p>
    </div>
  );
}
