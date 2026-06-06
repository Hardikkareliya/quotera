import type { ReactNode } from "react";
import { Suspense } from "react";

import {
  DashboardMobileHeader,
  DashboardSidebar,
} from "@/components/layout/dashboard-chrome";
import { Skeleton } from "@/components/ui/skeleton";

function SidebarFallback() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <Skeleton className="h-10 w-32" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function MobileHeaderFallback() {
  return <Skeleton className="h-14 w-full rounded-none lg:hidden" />;
}

type Props = {
  children: ReactNode;
};

/** Sync shell — avoids layout-level Suspense around `{children}` (hydration-safe). */
export function DashboardShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 bg-sidebar lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <Suspense fallback={<SidebarFallback />}>
              <DashboardSidebar />
            </Suspense>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Suspense fallback={<MobileHeaderFallback />}>
            <DashboardMobileHeader />
          </Suspense>
          <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
