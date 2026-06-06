import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-sky-50 text-sky-600",
  neutral: "bg-slate-100 text-slate-600",
} as const;

type Tone = keyof typeof tones;

export function StatCard({
  label,
  hint,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  hint?: string;
  value: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          ) : null}
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
