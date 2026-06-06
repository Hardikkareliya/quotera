import { Sparkles } from "lucide-react";

import { AuthDashboardPreview } from "@/components/auth/auth-dashboard-preview";
import { FlexHubLogo } from "@/components/brand/flexhub-logo";
import { APP_NAME } from "@/lib/app-brand";
import { LAUNCH_PROMO_CODE, LAUNCH_PROMO_LABEL } from "@/lib/landing-content";

const trustPoints = [
  { label: "GST-ready", detail: "CGST · SGST · IGST" },
  { label: "Setup", detail: "Under 5 minutes" },
  { label: "Share", detail: "PDF + WhatsApp" },
] as const;

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#1a3d34] via-[#183830] to-[#122b24] lg:flex lg:w-[52%] xl:w-1/2">
      <div className="auth-panel-dots-dark absolute inset-0 opacity-[0.28]" />
      <div className="pointer-events-none absolute -left-24 top-0 size-80 rounded-full bg-[#2a5c4d]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-[#f2ebe0]/[0.05] blur-3xl" />

      <div className="relative flex min-h-screen w-full flex-col px-10 py-10 xl:px-14 xl:py-12">
        <FlexHubLogo href="/" size="lg" variant="on-dark" showTagline />

        <div className="mt-8 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f2ebe0]/15 bg-[#f2ebe0]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f2ebe0]/85">
            <Sparkles className="size-3.5" />
            Early access · India
          </span>

          <h1 className="mt-5 font-[family-name:var(--font-outfit)] text-[36px] font-bold leading-[1.08] tracking-tight text-[#f2ebe0] xl:text-[42px]">
            Run your business{" "}
            <span className="bg-gradient-to-r from-[#f2ebe0] via-[#d4e4dc] to-[#a8c4b8] bg-clip-text text-transparent">
              like a pro
            </span>
          </h1>

          <div className="mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-[#f2ebe0] via-[#2a5c4d] to-transparent" />

          <p className="mt-5 max-w-md text-[15px] leading-7 text-[#f2ebe0]/70">
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
              className="rounded-[14px] border border-[#f2ebe0]/10 bg-[#f2ebe0]/[0.06] px-3 py-3 text-center backdrop-blur-sm"
            >
              <p className="text-[13px] font-bold text-[#f2ebe0]">{item.label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-[#f2ebe0]/55">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#f2ebe0]/10 pt-6">
          <div className="inline-flex items-center gap-2.5 rounded-[12px] border border-[#f2ebe0]/12 bg-[#f2ebe0]/10 px-3.5 py-2.5">
            <span className="auth-panel-promo-shimmer rounded-md px-2 py-0.5 text-[11px] font-bold text-[#1a3d34]">
              {LAUNCH_PROMO_CODE}
            </span>
            <span className="text-[11px] font-medium text-[#f2ebe0]/75">
              {LAUNCH_PROMO_LABEL}
            </span>
          </div>
          <p className="text-[11px] text-[#f2ebe0]/40">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </div>
    </aside>
  );
}
