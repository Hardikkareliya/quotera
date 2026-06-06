"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { FlexHubLogo } from "@/components/brand/flexhub-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard?period=month", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/quotations", label: "Quotes" },
  { href: "/invoices", label: "Invoices" },
  { href: "/settings", label: "Settings" },
];

export function MobileNav({ orgName }: { orgName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative border-b border-border bg-card px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <FlexHubLogo href="/dashboard" size="sm" variant="on-light" />
          {orgName ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{orgName}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <nav className="absolute left-0 right-0 top-full z-50 flex flex-col gap-0.5 border-b border-border bg-card p-2 shadow-soft">
          {links.map(({ href, label }) => {
            const base = href.split("?")[0];
            const active =
              base === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === base || pathname.startsWith(`${base}/`);
            return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
