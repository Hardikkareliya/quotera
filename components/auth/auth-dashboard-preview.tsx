import {
  BarChart3,
  CheckCircle2,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

export function AuthDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="auth-panel-glow pointer-events-none absolute -inset-4 rounded-[28px] bg-[#f2ebe0]/[0.07] blur-2xl" />

      <div className="auth-panel-float-slow absolute -left-4 top-6 z-20 rounded-[12px] border border-[#f2ebe0]/20 bg-[#fcfaf6]/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <p className="text-[11px] font-medium text-[#5c6e66]">This month</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[15px] font-bold text-[#1a3d34]">₹2.8L</p>
          <TrendingUp className="size-4 text-[#2a5c4d]" />
        </div>
      </div>

      <div className="auth-panel-float relative overflow-hidden rounded-[22px] border border-[#f2ebe0]/15 bg-[#fcfaf6] shadow-[0_32px_70px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1a3d34] via-[#2a5c4d] to-[#1a3d34]/40" />

        <div className="border-b border-[#1a3d34]/8 bg-[#f8f4ec] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[#1a3d34]">Dashboard</p>
              <p className="text-[11px] text-[#5c6e66]">Welcome back 👋</p>
            </div>
            <span className="rounded-full bg-[#1a3d34] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#f2ebe0]">
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
            <div
              key={item.label}
              className="rounded-[12px] border border-[#1a3d34]/8 bg-[#fcfaf6] p-3"
            >
              <div className="mb-2 flex size-8 items-center justify-center rounded-[8px] bg-[#1a3d34]/10 text-[#1a3d34]">
                <item.icon className="size-4" />
              </div>
              <p className="text-[16px] font-bold text-[#1a3d34]">{item.value}</p>
              <p className="text-[10px] text-[#5c6e66]">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1a3d34]/8 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#5c6e66]">
            Recent
          </p>
          <div className="space-y-2">
            {[
              { name: "TechCorp Solutions", status: "Paid" },
              { name: "Design Studio", status: "Pending" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-[10px] bg-[#f8f4ec] px-3 py-2"
              >
                <span className="truncate text-[12px] font-medium text-[#1a3d34]">
                  {row.name}
                </span>
                <span
                  className={
                    row.status === "Paid"
                      ? "inline-flex items-center gap-1 rounded-full bg-[#1a3d34]/10 px-2 py-0.5 text-[9px] font-semibold text-[#1a3d34]"
                      : "rounded-full bg-[#e8e0d4] px-2 py-0.5 text-[9px] font-semibold text-[#1a3d34]"
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

      <div className="auth-panel-float-delay absolute -bottom-3 -right-3 z-20 rounded-[12px] bg-[#1a3d34] px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
        <p className="text-[11px] font-medium text-[#f2ebe0]/75">WhatsApp sent</p>
        <p className="text-[12px] font-semibold text-[#f2ebe0]">Invoice shared ✓</p>
      </div>

      <div className="auth-panel-float absolute -right-2 top-[42%] z-10 flex size-10 rotate-6 items-center justify-center rounded-[10px] bg-[#2a5c4d] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
        <MessageSquare className="size-4 text-[#f2ebe0]" />
      </div>
    </div>
  );
}
