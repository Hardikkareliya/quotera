"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { QuoteraLogo } from "@/components/brand/quotera-logo";
import { EARLY_ACCESS_NOTE, landingNav } from "@/lib/landing-content";
import { cn } from "@/lib/utils";

import { EarlyAccessCtaButton } from "./early-access-cta";

export function PromoBar() {
  return (
    <div className="relative overflow-hidden bg-[var(--qt-brand)] px-4 py-2.5 text-center text-[13px] font-medium text-[var(--qt-cream)] sm:text-[14px]">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--qt-accent)]/10 via-transparent to-[var(--qt-accent)]/10" />
      <p className="relative">{EARLY_ACCESS_NOTE}</p>
    </div>
  );
}

export function LandingNav() {
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
            ? "border-b border-[var(--qt-brand)]/10 bg-[var(--qt-cream)]/95 shadow-[0_8px_30px_-20px_rgb(var(--qt-brand-rgb) /0.15)] backdrop-blur-xl"
            : "bg-[var(--qt-cream)]/90 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-5 sm:px-8 lg:py-6">
          <QuoteraLogo href="/" size="xl" variant="on-cream" />

          <nav className="hidden items-center gap-8 lg:flex">
            {landingNav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "quotera-nav-link text-[16px] font-medium transition-colors duration-200 hover:text-[var(--qt-brand)]",
                  i === 0 ? "text-[var(--qt-ink)] text-[18px]" : "text-[var(--qt-muted)]",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex">
            <EarlyAccessCtaButton className="!px-5 !py-2.5 text-[16px]" showArrow>
              Apply for early access
            </EarlyAccessCtaButton>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex size-10 items-center justify-center rounded-[10px] border border-[var(--qt-brand)]/15 text-[var(--qt-brand)] transition-colors hover:bg-[var(--qt-brand)]/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[var(--qt-brand)]/30 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-x-4 top-24 z-50 rounded-[20px] border border-[var(--qt-brand)]/10 bg-[var(--qt-card)] p-5 shadow-[0_24px_60px_rgb(var(--qt-brand-rgb) /0.15)] transition-all duration-300 lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1">
          {landingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-3 py-3 text-[16px] font-medium text-[var(--qt-ink)] transition-colors hover:bg-[var(--qt-cream-light)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-4 border-t border-[var(--qt-brand)]/10 pt-4">
          <EarlyAccessCtaButton
            className="w-full !py-3 text-[16px]"
            showArrow
            onAfterClick={() => setOpen(false)}
          >
            Apply for early access
          </EarlyAccessCtaButton>
        </div>
      </div>
    </>
  );
}
