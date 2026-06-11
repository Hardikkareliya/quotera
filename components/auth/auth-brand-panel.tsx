import { Sparkles } from "lucide-react";

import { AuthDashboardPreview } from "@/components/auth/auth-dashboard-preview";
import { QuoteraLogo } from "@/components/brand/quotera-logo";
import { APP_NAME } from "@/lib/app-brand";
import { colors, ui } from "@/lib/colors";
import { LAUNCH_PROMO_CODE, LAUNCH_PROMO_LABEL } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

const trustPoints = [
  { label: "GST-ready", detail: "CGST · SGST · IGST" },
  { label: "Setup", detail: "Under 5 minutes" },
  { label: "Share", detail: "PDF + WhatsApp" },
] as const;

export function AuthBrandPanel() {
  return (
    <aside className={cn(ui.authPanel, ui.authPanelGradient)}>
      <div className="auth-panel-dots-dark absolute inset-0 opacity-[0.28]" />
      <div
        className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.brand.light}40` }}
      />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-[var(--qt-cream-on-dark)]/[0.05] blur-3xl" />

      <div className="relative flex min-h-screen w-full flex-col px-10 py-10 xl:px-14 xl:py-12">
        <QuoteraLogo href="/" size="lg" variant="on-dark" showTagline />

        <div className="mt-8 max-w-lg">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-[var(--qt-cream-on-dark)]/15 bg-[var(--qt-cream-on-dark)]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
              ui.onDark,
              "opacity-85",
            )}
          >
            <Sparkles className="size-3.5" />
            Early access · India
          </span>

          <h1
            className={cn(
              "mt-5 font-[family-name:var(--font-outfit)] text-[36px] font-bold leading-[1.08] tracking-tight xl:text-[42px]",
              ui.onDark,
            )}
          >
            Run your business{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.cream.onDark}, ${colors.gradient.mint}, ${colors.gradient.sage})`,
              }}
            >
              like a pro
            </span>
          </h1>

          <div
            className="mt-5 h-[3px] w-24 rounded-full"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.cream.onDark}, ${colors.brand.light}, transparent)`,
            }}
          />

          <p className={cn("mt-5 max-w-md text-[15px] leading-7", ui.onDarkMuted)}>
            Manage clients, GST quotations, invoices, and payments in one
            beautiful dashboard.
          </p>
        </div>

        <div className="my-8 flex flex-1 items-center justify-center py-2">
          <AuthDashboardPreview />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {trustPoints.map((item) => (
            <div
              key={item.label}
              className="rounded-[14px] border border-[var(--qt-cream-on-dark)]/10 bg-[var(--qt-cream-on-dark)]/[0.06] px-3 py-3 text-center backdrop-blur-sm"
            >
              <p className={cn("text-[13px] font-bold", ui.onDark)}>{item.label}</p>
              <p className={cn("mt-0.5 text-[10px] leading-snug", ui.onDarkSubtle)}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--qt-cream-on-dark)]/10 pt-6">
          <div className="inline-flex items-center gap-2.5 rounded-[12px] border border-[var(--qt-cream-on-dark)]/12 bg-[var(--qt-cream-on-dark)]/10 px-3.5 py-2.5">
            <span className={cn("auth-panel-promo-shimmer rounded-md px-2 py-0.5 text-[11px] font-bold", ui.ink)}>
              {LAUNCH_PROMO_CODE}
            </span>
            <span className={cn("text-[11px] font-medium", ui.onDark, "opacity-75")}>
              {LAUNCH_PROMO_LABEL}
            </span>
          </div>
          <p className={cn("text-[11px]", ui.onDarkFaint)}>
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>
    </aside>
  );
}
