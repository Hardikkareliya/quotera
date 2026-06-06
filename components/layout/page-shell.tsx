import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  title: string;
  description?: string;
  backHref: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Applied to the main content block (use `w-full min-w-0` on detail pages). */
  contentClassName?: string;
};

export function PageShell({
  title,
  description,
  backHref,
  backLabel = "Back",
  breadcrumbs,
  actions,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <div className={cn("w-full min-w-0 space-y-6", className)}>
      <div className="space-y-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
          >
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 ? <ChevronRight className="size-3.5" /> : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </div>

      <div className={cn("w-full min-w-0", contentClassName)}>{children}</div>
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card md:p-6">
      <div className="mb-5 border-b border-border pb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
