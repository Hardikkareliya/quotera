import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children?: ReactNode;
};

export function PageHeader({ title, description, action, children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.65rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {action ? (
          <Button asChild className="rounded-lg shadow-sm">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
