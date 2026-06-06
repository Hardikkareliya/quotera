import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-12 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-8 w-28" />
        </div>
      ))}
    </div>
  );
}
