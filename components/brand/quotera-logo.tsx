import Link from "next/link";

import { APP_NAME, APP_TAGLINE } from "@/lib/app-brand";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

type LogoVariant = "on-dark" | "on-light" | "on-cream" | "sidebar";

type QuoteraLogoProps = {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: LogoVariant;
};

const markSizes = {
  sm: "size-8",
  md: "size-9",
  lg: "size-11",
  xl: "size-14",
} as const;

const wordmarkSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-[32px] sm:text-[40px]",
} as const;

const logoMarkPalette = {
  "on-light": {
    bg: colors.cream.DEFAULT,
    fg: colors.brand.DEFAULT,
    leaf: colors.brand.light,
  },
  "on-cream": {
    bg: colors.brand.DEFAULT,
    fg: colors.cream.onDark,
    leaf: colors.brand.light,
  },
  "on-dark": {
    bg: colors.brand.DEFAULT,
    fg: colors.cream.onDark,
    leaf: colors.brand.light,
  },
  sidebar: {
    bg: colors.brand.DEFAULT,
    fg: colors.cream.onDark,
    leaf: colors.brand.light,
  },
} as const;

export function QuoteraLogoMark({
  className,
  size = "md",
  variant = "on-dark",
}: {
  className?: string;
  size?: QuoteraLogoProps["size"];
  variant?: LogoVariant;
}) {
  const palette = logoMarkPalette[variant];

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn(markSizes[size], "shrink-0", className)}
    >
      <rect width="48" height="48" rx="14" fill={palette.bg} />
      <path d="M15 14H31V18H21V22H29V26H21V34H15V14Z" fill={palette.fg} />
      <path
        d="M29.5 16.5C33.5 17.2 35.8 19.8 34.8 23.2C33.5 22.4 31.8 20.2 29.5 16.5Z"
        fill={palette.leaf}
      />
      <circle cx="33" cy="31" r="2.5" fill={palette.fg} opacity="0.85" />
    </svg>
  );
}

export function QuoteraLogo({
  className,
  href,
  showWordmark = true,
  showTagline = false,
  size = "md",
  variant = "on-dark",
}: QuoteraLogoProps) {
  const textColor =
    variant === "on-light" || variant === "on-cream"
      ? "text-foreground"
      : variant === "sidebar"
        ? "text-sidebar-foreground"
        : "text-[var(--qt-cream-on-dark)]";

  const taglineColor =
    variant === "sidebar"
      ? "text-sidebar-muted"
      : variant === "on-light" || variant === "on-cream"
        ? "text-muted-foreground"
        : "text-[var(--qt-cream-on-dark)]/70";

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <QuoteraLogoMark size={size} variant={variant} />
      {showWordmark ? (
        <span className="min-w-0 text-left leading-none">
          <span
            className={cn(
              "block font-[family-name:var(--font-outfit)] font-bold tracking-tight",
              wordmarkSizes[size],
              textColor,
            )}
          >
            {APP_NAME}
          </span>
          {showTagline ? (
            <span className={cn("mt-0.5 block text-[11px] font-medium", taglineColor)}>
              {APP_TAGLINE}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
