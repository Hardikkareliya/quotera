import { parseDecimalToPaise, paiseToDecimal } from "@/lib/money";
import {
  getPeriodLabel,
  periodStart,
  type DashboardPeriod,
} from "@/lib/dashboard-period";
import { createClient } from "@/lib/supabase/server";

export type { DashboardPeriod } from "@/lib/dashboard-period";
export { parseDashboardPeriod, getPeriodLabel } from "@/lib/dashboard-period";

function toDateIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function paymentsRangeStart(period: DashboardPeriod): string {
  const start = periodStart(period);
  if (start) return toDateIso(start);

  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  d.setDate(1);
  return toDateIso(d);
}

function isOnOrAfter(dateStr: string, startIso: string | null): boolean {
  if (!startIso) return true;
  return dateStr.slice(0, 10) >= startIso;
}

export async function getDashboardAnalytics(
  orgId: string,
  period: DashboardPeriod = "month",
) {
  const supabase = await createClient();
  const start = periodStart(period);
  const startIso = start ? toDateIso(start) : null;
  const paymentsFrom = paymentsRangeStart(period);

  const paymentsQuery = supabase
    .from("payments")
    .select("amount, paid_at")
    .eq("org_id", orgId)
    .gte("paid_at", paymentsFrom)
    .order("paid_at", { ascending: true });

  let invoicesQuery = supabase
    .from("invoices")
    .select("total, amount_paid, status, issue_date")
    .eq("org_id", orgId);

  if (startIso) {
    invoicesQuery = invoicesQuery.gte("issue_date", startIso);
  } else {
    invoicesQuery = invoicesQuery.gte("issue_date", paymentsFrom);
  }

  let quotesCountQuery = supabase
    .from("quotations")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  if (startIso) {
    quotesCountQuery = quotesCountQuery.gte("issue_date", startIso);
  } else {
    quotesCountQuery = quotesCountQuery.gte("issue_date", paymentsFrom);
  }

  const [
    { data: payments },
    { data: periodInvoices },
    { data: allOpenInvoices },
    { count: quoteCount },
    { count: clientCount },
  ] = await Promise.all([
    paymentsQuery.limit(500),
    invoicesQuery,
    supabase
      .from("invoices")
      .select("total, amount_paid, status")
      .eq("org_id", orgId)
      .in("status", ["sent", "partially_paid", "overdue"]),
    quotesCountQuery,
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
  ]);

  const paymentRows = payments ?? [];
  const invoiceRows = periodInvoices ?? [];

  let revenuePaise = 0;
  let paymentCount = 0;
  for (const p of paymentRows) {
    if (!isOnOrAfter(p.paid_at, startIso)) continue;
    revenuePaise += parseDecimalToPaise(String(p.amount));
    paymentCount += 1;
  }

  let outstandingPaise = 0;
  for (const inv of allOpenInvoices ?? []) {
    const total = parseDecimalToPaise(String(inv.total));
    const paid = parseDecimalToPaise(String(inv.amount_paid));
    if (paid < total) outstandingPaise += total - paid;
  }

  const statusCounts: Record<string, number> = {
    draft: 0,
    sent: 0,
    partially_paid: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0,
  };

  for (const inv of invoiceRows) {
    statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
  }

  const monthlyMap = new Map<string, number>();
  for (const p of paymentRows) {
    if (!isOnOrAfter(p.paid_at, startIso)) continue;
    const d = new Date(p.paid_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(
      key,
      (monthlyMap.get(key) ?? 0) + parseDecimalToPaise(String(p.amount)),
    );
  }

  const revenueByMonth = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, paise]) => ({
      month,
      label: new Date(`${month}-01`).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      revenue: paise / 100,
    }));

  const pipeline = [
    { name: "Draft", value: statusCounts.draft, fill: "#94a3b8" },
    { name: "Sent", value: statusCounts.sent, fill: "#1a3d34" },
    { name: "Partial", value: statusCounts.partially_paid, fill: "#d97706" },
    { name: "Paid", value: statusCounts.paid, fill: "#059669" },
    { name: "Overdue", value: statusCounts.overdue, fill: "#dc2626" },
  ].filter((d) => d.value > 0);

  return {
    revenue: paiseToDecimal(revenuePaise),
    outstanding: paiseToDecimal(outstandingPaise),
    invoiceCount: invoiceRows.length,
    quoteCount: quoteCount ?? 0,
    clientCount: clientCount ?? 0,
    paymentCount,
    revenueByMonth,
    pipeline,
    statusCounts,
    periodLabel: getPeriodLabel(period),
  };
}
