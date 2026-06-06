import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DashboardSection({ title, description, children }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
