import { PageHeaderSkeleton } from "@/components/loading/page-header-skeleton";
import { TableSkeleton } from "@/components/loading/table-skeleton";

export default function DashboardSegmentLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <TableSkeleton rows={5} />
    </div>
  );
}
