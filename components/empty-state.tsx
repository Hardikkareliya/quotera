import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] bg-card px-6 py-16 text-center shadow-card">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
        ✦
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-8 rounded-xl">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
