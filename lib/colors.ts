/**
 * Quotera design tokens — single source of truth for brand colors.
 * CSS variables are generated into app/brand-tokens.css (`npm run gen:colors`).
 */
export const colors = {
  brand: {
    DEFAULT: "#1a3d34",
    dark: "#122b24",
    light: "#2a5c4d",
    mid: "#183830",
    darkCard: "#224a3f",
  },
  cream: {
    DEFAULT: "#f8f4ee",
    light: "#fcfaf6",
    onDark: "#f2ebe0",
    accentDark: "#ebe4db",
    uiAccent: "#efe9e2",
  },
  card: "#fefdfb",
  ink: "#1a3d34",
  muted: {
    DEFAULT: "#5c6e66",
    sidebar: "#a8bdb4",
  },
  border: "#e4ddd3",
  destructive: "#dc2626",
  warning: "#b45309",
  success: "#2a5c4d",
  gradient: {
    mint: "#d4e4dc",
    sage: "#a8c4b8",
  },
} as const;

/** Space-separated RGB channels for `rgb(var(--qt-brand-rgb) / 0.5)` */
export const colorRgb = {
  brand: "26 61 52",
  creamOnDark: "242 235 224",
} as const;

/** Forest preset for PDF / document themes — derived from brand tokens */
export const forestDocumentTheme = {
  accent: colors.brand.DEFAULT,
  accentSoft: colors.cream.DEFAULT,
  tableHead: colors.cream.light,
} as const;

/** Default custom accent swatch in settings */
export const defaultCustomAccent = colors.brand.DEFAULT;

/** Reusable Tailwind class fragments (tree-shakeable, no runtime cost) */
export const ui = {
  fieldInput: "h-11 rounded-xl border-border bg-card px-4",
  authLayout: "flex min-h-screen bg-background",
  authCard:
    "rounded-[28px] border border-primary/10 bg-card shadow-[0_24px_60px_rgb(var(--qt-brand-rgb)/0.1)]",
  authPanel: "relative hidden min-h-screen overflow-hidden lg:flex lg:w-[52%] xl:w-1/2",
  authPanelGradient:
    "bg-gradient-to-br from-[var(--qt-brand)] via-[var(--qt-brand-mid)] to-[var(--qt-brand-dark)]",
  onDark: "text-[var(--qt-cream-on-dark)]",
  onDarkMuted: "text-[var(--qt-cream-on-dark)]/70",
  onDarkSubtle: "text-[var(--qt-cream-on-dark)]/55",
  onDarkFaint: "text-[var(--qt-cream-on-dark)]/40",
  ink: "text-foreground",
  muted: "text-muted-foreground",
  brandBg: "bg-primary",
  brandLightBg: "bg-[var(--qt-brand-light)]",
  promoBadge: "rounded-md bg-primary px-1.5 py-0.5 font-bold text-[var(--qt-cream-on-dark)]",
  promoBox: "rounded-[14px] border border-primary/10 bg-secondary px-4 py-3",
} as const;
