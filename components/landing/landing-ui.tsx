import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function FigmaButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  showArrow,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "white" | "ghost" | "green";
  onClick?: () => void;
  showArrow?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[10px] px-[30px] py-5 text-[18px] font-semibold transition-all duration-300 ease-out",
        variant === "primary" &&
          "bg-[var(--qt-primary-bg)] text-[var(--qt-primary-text)] hover:-translate-y-0.5 hover:bg-[var(--qt-primary-hover)] hover:shadow-[0_16px_32px_-12px_rgb(var(--qt-primary-rgb)/0.45)] active:translate-y-0",
        variant === "green" &&
          "bg-[var(--qt-brand)] text-[var(--qt-cream)] hover:-translate-y-0.5 hover:bg-[var(--qt-brand-dark)] hover:shadow-[0_16px_32px_-12px_rgb(var(--qt-brand-rgb)/0.4)]",
        variant === "outline" &&
          "border-2 border-[var(--qt-brand)] bg-transparent text-[var(--qt-brand)] hover:bg-[var(--qt-brand)]/5",
        variant === "white" &&
          "bg-[var(--qt-card)] text-[var(--qt-brand)] shadow-[0_4px_9px_rgb(var(--qt-brand-rgb) /0.08)] hover:-translate-y-0.5 hover:bg-[var(--qt-cream-light)]",
        variant === "ghost" &&
          "bg-transparent text-[var(--qt-muted)] hover:text-[var(--qt-brand)]",
        className,
      )}
    >
      {variant === "primary" ? (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      ) : null}
      <span className="relative inline-flex items-center gap-2">
        {children}
        {showArrow ? (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        ) : null}
      </span>
    </a>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--qt-brand)]/15 bg-[var(--qt-cream-light)] px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--qt-brand)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FigmaCheck({ children }: { children: React.ReactNode }) {
  return (
    <li className="group flex items-start gap-4 transition-transform duration-300 hover:translate-x-1">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--qt-accent)] text-sm font-bold text-[var(--qt-brand)] shadow-[0_4px_12px_rgb(var(--qt-accent-rgb)/0.35)] transition-transform duration-300 group-hover:scale-110">
        ✓
      </span>
      <span className="text-[18px] font-medium leading-[30px] text-[var(--qt-ink)]">
        {children}
      </span>
    </li>
  );
}

export function SectionTitle({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <h2
      className={cn(
        "font-[family-name:var(--font-outfit)] text-[36px] font-bold leading-[1.15] tracking-tight sm:text-[50px]",
        light ? "text-[var(--qt-cream)]" : "text-[var(--qt-ink)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionSubtitle({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-[16px] font-medium leading-[30px] sm:text-[18px]",
        light ? "text-[var(--qt-cream)]/80" : "text-[var(--qt-muted)]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function FigmaCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--qt-brand)]/18 bg-[var(--qt-card)] shadow-[0_8px_24px_rgb(var(--qt-brand-rgb)/0.08)] ring-1 ring-[var(--qt-brand)]/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--qt-brand)]/30 hover:shadow-[0_20px_40px_rgb(var(--qt-brand-rgb)/0.12)] hover:ring-[var(--qt-brand)]/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FloatingChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[var(--qt-brand)]/10 bg-[var(--qt-card)]/95 px-4 py-3 shadow-[0_8px_24px_rgb(var(--qt-brand-rgb) /0.1)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
