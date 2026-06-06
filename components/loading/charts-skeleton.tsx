export function ChartsSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="h-[320px] animate-pulse rounded-xl border border-border bg-card shadow-card"
        />
      ))}
    </div>
  );
}
