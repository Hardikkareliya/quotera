import {
  FileText,
  IndianRupee,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { DashboardChartsLazy } from "@/components/dashboard/dashboard-charts-lazy";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatMoney } from "@/lib/format";
import {
  getDashboardAnalytics,
  type DashboardPeriod,
} from "@/lib/dashboard-analytics";

export async function DashboardBody({
  orgId,
  period,
}: {
  orgId: string;
  period: DashboardPeriod;
}) {
  const analytics = await getDashboardAnalytics(orgId, period);

  return (
    <div className="space-y-8">
      <DashboardSection
        title="Money"
        description={`For ${analytics.periodLabel}`}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Revenue collected"
            hint="Payments received in selected period"
            value={formatMoney(analytics.revenue)}
            icon={IndianRupee}
            tone="success"
          />
          <StatCard
            label="Outstanding"
            hint="All unpaid sent / partial / overdue invoices"
            value={formatMoney(analytics.outstanding)}
            icon={Wallet}
            tone="warning"
          />
          <StatCard
            label="Payments"
            hint="Payment entries in selected period"
            value={String(analytics.paymentCount)}
            icon={Receipt}
            tone="primary"
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Business"
        description={`Documents in ${analytics.periodLabel.toLowerCase()}`}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Clients"
            hint="Total clients (all time)"
            value={String(analytics.clientCount)}
            icon={TrendingUp}
            tone="info"
          />
          <StatCard
            label="Invoices"
            hint="Issued in selected period"
            value={String(analytics.invoiceCount)}
            icon={Receipt}
            tone="primary"
          />
          <StatCard
            label="Quotations"
            hint="Created in selected period"
            value={String(analytics.quoteCount)}
            icon={FileText}
            tone="neutral"
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Charts"
        description={`Based on ${analytics.periodLabel.toLowerCase()}`}
      >
        <DashboardChartsLazy
          periodLabel={analytics.periodLabel}
          revenueByMonth={analytics.revenueByMonth}
          pipeline={analytics.pipeline}
          paidCount={analytics.statusCounts.paid ?? 0}
        />
      </DashboardSection>
    </div>
  );
}
