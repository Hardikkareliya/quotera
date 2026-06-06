"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FloatCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn("flexhub-float motion-reduce:animate-none", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
