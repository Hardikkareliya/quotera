import {
  BarChart3,
  CheckCircle2,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

import { ui } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function AuthDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="auth-panel-glow pointer-events-none absolute -inset-4 rounded-[28px] bg-[var(--qt-cream-on-dark)]/[0.07] blur-2xl" />

      <div className="auth-panel-float-slow absolute -left-4 top-6 z-20 rounded-[12px] border border-[var(--qt-cream-on-dark)]/20 bg-card/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <p className={cn("text-[11px] font-medium", ui.muted)}>This month</p>
        <div className="mt-1 flex items-center gap-2">
          <p className={cn("text-[15px] font-bold", ui.ink)}>₹2.8L</p>
          <TrendingUp className="size-4 text-[var(--qt-brand-light)]" />
        </div>
      </div>

      <div className="auth-panel-float relative overflow-hidden rounded-[22px] border border-[var(--qt-cream-on-dark)]/15 bg-card shadow-[0_32px_70px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[var(--qt-brand-light)] to-primary/40" />

        <div className="border-b border-primary/8 bg-secondary px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-[14px] font-semibold", ui.ink)}>Dashboard</p>
              <p className={cn("text-[11px]", ui.muted)}>Welcome back 👋</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide", ui.brandBg, ui.onDark)}>
              LIVE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-4">
          {[
            { label: "Revenue", value: "₹12.5L", icon: TrendingUp },
            { label: "Clients", value: "156", icon: Users },
            { label: "Pending", value: "18", icon: FileText },
            { label: "Month", value: "₹2.8L", icon: BarChart3 },
          ].map((item) => (
            <div key={item.label} className="rounded-[12px] border border-primary/8 bg-card p-3">
              <div className="mb-2 flex size-8 items-center justify-center rounded-[8px] bg-primary/10 text-primary">
                <item.icon className="size-4" />
              </div>
              <p className={cn("text-[16px] font-bold", ui.ink)}>{item.value}</p>
              <p className={cn("text-[10px]", ui.muted)}>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-primary/8 px-4 py-3">
          <p className={cn("mb-2 text-[10px] font-semibold uppercase tracking-wider", ui.muted)}>
            Recent
          </p>
          <div className="space-y-2">
            {[
              { name: "TechCorp Solutions", status: "Paid" },
              { name: "Design Studio", status: "Pending" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[10px] bg-secondary px-3 py-2"
              >
                <span className={cn("truncate text-[12px] font-medium", ui.ink)}>
                  {row.name}
                </span>
                <span
                  className={
                    row.status === "Paid"
                      ? "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary"
                      : "rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold text-primary"
                  }
                >
                  {row.status === "Paid" ? (
                    <CheckCircle2 className="size-2.5" />
                  ) : null}
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel-float-delay absolute -bottom-3 -right-3 z-20 rounded-[12px] bg-primary px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
        <p className={cn("text-[11px] font-medium", ui.onDark, "opacity-75")}>WhatsApp sent</p>
        <p className={cn("text-[12px] font-semibold", ui.onDark)}>Invoice shared ✓</p>
      </div>

      <div className={cn("auth-panel-float absolute -right-2 top-[42%] z-10 flex size-10 rotate-6 items-center justify-center rounded-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.25)]", ui.brandLightBg)}>
        <MessageSquare className={cn("size-4", ui.onDark)} />
      </div>
    </div>
  );
}
