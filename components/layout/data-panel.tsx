import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DataPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] bg-card shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
