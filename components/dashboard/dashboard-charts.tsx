"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  periodLabel: string;
  revenueByMonth: { label: string; revenue: number }[];
  pipeline: { name: string; value: number; fill: string }[];
  paidCount: number;
};

export function DashboardCharts({
  periodLabel,
  revenueByMonth,
  pipeline,
  paidCount,
}: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Revenue trend</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Payments in {periodLabel}
        </p>
        <div className="mt-4 h-[260px] w-full">
          {revenueByMonth.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
              <p>No payments yet</p>
              <p className="text-xs">Record a payment on an invoice to see this chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByMonth}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
                    "Collected",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground">Invoice status</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Invoices issued in {periodLabel} · {paidCount} marked paid
        </p>
        <div className="mt-4 h-[260px] w-full">
          {pipeline.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
              <p>No invoices in this period</p>
              <p className="text-xs">Create an invoice to see status breakdown</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipeline}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {pipeline.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {pipeline.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {pipeline.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.fill }}
                />
                <span>
                  {p.name}{" "}
                  <span className="font-medium text-foreground">({p.value})</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
