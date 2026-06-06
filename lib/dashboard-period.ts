export type DashboardPeriod = "month" | "quarter" | "year" | "all";

const PERIOD_VALUES: DashboardPeriod[] = ["month", "quarter", "year", "all"];

export function parseDashboardPeriod(value?: string | null): DashboardPeriod {
  if (value && PERIOD_VALUES.includes(value as DashboardPeriod)) {
    return value as DashboardPeriod;
  }
  return "month";
}

export function getPeriodLabel(period: DashboardPeriod): string {
  const now = new Date();
  if (period === "month") {
    return now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  if (period === "quarter") {
    const qStart = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), qStart, 1);
    const end = new Date(now.getFullYear(), qStart + 3, 0);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }
  if (period === "year") {
    return `Calendar year ${now.getFullYear()}`;
  }
  return "All time (last 12 months)";
}

export const PERIOD_OPTIONS: {
  value: DashboardPeriod;
  label: string;
  short: string;
}[] = [
  { value: "month", label: "This month", short: "Month" },
  { value: "quarter", label: "This quarter", short: "Quarter" },
  { value: "year", label: "This year", short: "Year" },
  { value: "all", label: "All time", short: "All" },
];

export function dashboardPeriodHref(period: DashboardPeriod) {
  return `/dashboard?period=${period}`;
}

export function getPeriodScopeNote(period: DashboardPeriod): string {
  switch (period) {
    case "month":
      return "Revenue, payments, and new invoices/quotes are counted for the current calendar month.";
    case "quarter":
      return "Revenue, payments, and new invoices/quotes are counted for the current calendar quarter.";
    case "year":
      return "Revenue, payments, and new invoices/quotes are counted for the current calendar year.";
    case "all":
      return "Revenue and documents use the last 12 months. Client total is always all-time.";
  }
}

export function periodStart(period: DashboardPeriod): Date | null {
  const now = new Date();
  if (period === "all") return null;
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (period === "quarter") {
    const q = Math.floor(now.getMonth() / 3) * 3;
    return new Date(now.getFullYear(), q, 1);
  }
  return new Date(now.getFullYear(), 0, 1);
}
