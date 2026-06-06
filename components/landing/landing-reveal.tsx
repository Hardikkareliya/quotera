import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  as?: "div" | "section" | "li";
};

const directionClass = {
  up: "flexhub-enter",
  left: "flexhub-enter flexhub-enter-from-left",
  right: "flexhub-enter flexhub-enter-from-right",
  none: "flexhub-enter flexhub-enter-fade",
} as const;

/** CSS-only entrance — no IntersectionObserver, no client JS. */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      className={cn(
        directionClass[direction],
        "motion-reduce:animate-none motion-reduce:opacity-100",
        className,
      )}
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
