"use client";

import dynamic from "next/dynamic";

import { ChartsSkeleton } from "@/components/loading/charts-skeleton";

const DashboardCharts = dynamic(
  () =>
    import("@/components/dashboard/dashboard-charts").then((m) => ({
      default: m.DashboardCharts,
    })),
  {
    loading: () => <ChartsSkeleton />,
    ssr: false,
  },
);

type Props = {
  periodLabel: string;
  revenueByMonth: { label: string; revenue: number }[];
  pipeline: { name: string; value: number; fill: string }[];
  paidCount: number;
};

export function DashboardChartsLazy(props: Props) {
  return <DashboardCharts {...props} />;
}
