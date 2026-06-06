"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard?period=month", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/quotations", label: "Quotations", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardNav({
  orgName,
  userEmail,
}: {
  orgName?: string;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-6 px-2">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-active text-sm font-bold text-white">
            F
          </span>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">FlexHub</p>
            <p className="text-[11px] text-sidebar-muted">Business CRM</p>
          </div>
        </Link>
      </div>

      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
        Main menu
      </p>
      <nav className="flex flex-1 flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const base = href.split("?")[0];
          const active =
            base === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === base || pathname.startsWith(`${base}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg bg-white/5 px-3 py-3">
        {orgName ? (
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {orgName}
          </p>
        ) : null}
        {userEmail ? (
          <p className="truncate text-xs text-sidebar-muted">{userEmail}</p>
        ) : null}
      </div>

      <form action="/api/auth/signout" method="POST" className="mt-3">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start rounded-lg text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </>
  );
}
