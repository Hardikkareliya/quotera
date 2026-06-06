"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { FlexHubLogo } from "@/components/brand/flexhub-logo";
import { LAUNCH_PROMO_CODE, landingNav } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

import { FigmaButton } from "./landing-ui";

type LandingNavProps = {
  registerHref: string;
};

export function PromoBar() {
  return (
    <div className="relative overflow-hidden bg-[var(--fh-brand)] px-4 py-2.5 text-center text-[13px] font-medium text-[var(--fh-cream)] sm:text-[14px]">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--fh-accent)]/10 via-transparent to-[var(--fh-accent)]/10" />
      <p className="relative">
        Early access open · Use code{" "}
        <span className="flexhub-promo-shimmer rounded-md px-2 py-0.5 font-bold text-[var(--fh-brand)]">
          {LAUNCH_PROMO_CODE}
        </span>{" "}
        for 3 months free
      </p>
    </div>
  );
}

export function LandingNav({ registerHref }: LandingNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <PromoBar />
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[var(--fh-brand)]/10 bg-[var(--fh-cream)]/95 shadow-[0_8px_30px_-20px_rgb(var(--fh-brand-rgb) /0.15)] backdrop-blur-xl"
            : "bg-[var(--fh-cream)]/90 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-5 sm:px-8 lg:py-6">
          <FlexHubLogo href="/" size="xl" variant="on-cream" />

          <nav className="hidden items-center gap-8 lg:flex">
            {landingNav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flexhub-nav-link text-[16px] font-medium transition-colors duration-200 hover:text-[var(--fh-brand)]",
                  i === 0 ? "text-[var(--fh-ink)] text-[18px]" : "text-[var(--fh-muted)]",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="/login"
              className="text-[16px] font-medium text-[var(--fh-muted)] transition-colors hover:text-[var(--fh-brand)]"
            >
              Login
            </Link>
            <FigmaButton href={registerHref} className="!px-5 !py-2.5 text-[16px]" showArrow>
              Sign Up
            </FigmaButton>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex size-10 items-center justify-center rounded-[10px] border border-[var(--fh-brand)]/15 text-[var(--fh-brand)] transition-colors hover:bg-[var(--fh-brand)]/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[var(--fh-brand)]/30 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-x-4 top-24 z-50 rounded-[20px] border border-[var(--fh-brand)]/10 bg-[var(--fh-card)] p-5 shadow-[0_24px_60px_rgb(var(--fh-brand-rgb) /0.15)] transition-all duration-300 lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1">
          {landingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-3 py-3 text-[16px] font-medium text-[var(--fh-ink)] transition-colors hover:bg-[var(--fh-cream-light)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-4 grid gap-2 border-t border-[var(--fh-brand)]/10 pt-4">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-[10px] px-3 py-3 text-center font-medium text-[var(--fh-brand)]"
          >
            Login
          </Link>
          <FigmaButton
            href={registerHref}
            className="w-full !py-3 text-[16px]"
            onClick={() => setOpen(false)}
            showArrow
          >
            Sign Up
          </FigmaButton>
        </div>
      </div>
    </>
  );
}
