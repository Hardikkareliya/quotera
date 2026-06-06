import { ChartsSkeleton } from "@/components/loading/charts-skeleton";
import { PageHeaderSkeleton } from "@/components/loading/page-header-skeleton";
import { StatsSkeleton } from "@/components/loading/stats-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardHomeLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-full max-w-md" />
      </div>
      <div className="space-y-8">
        <StatsSkeleton count={3} />
        <StatsSkeleton count={3} />
        <ChartsSkeleton />
      </div>
    </div>
  );
}
