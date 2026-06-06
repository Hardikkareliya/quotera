export const DOCUMENT_PRESET_IDS = [
  "forest",
  "blue",
  "slate",
  "teal",
  "navy",
  "maroon",
  "charcoal",
] as const;

export type DocumentPresetId = (typeof DOCUMENT_PRESET_IDS)[number];

export const DOCUMENT_STORED_THEME_IDS = [
  ...DOCUMENT_PRESET_IDS,
  "custom",
] as const;

export type DocumentStoredThemeId = (typeof DOCUMENT_STORED_THEME_IDS)[number];

export const DEFAULT_DOCUMENT_THEME: DocumentPresetId = "forest";
export const DEFAULT_CUSTOM_ACCENT = "#1a3d34";

export type DocumentThemeTokens = {
  id: DocumentStoredThemeId;
  label: string;
  accent: string;
  accentSoft: string;
  tableHead: string;
};

export const DOCUMENT_THEME_PRESETS: Record<
  DocumentPresetId,
  DocumentThemeTokens
> = {
  forest: {
    id: "forest",
    label: "Forest",
    accent: "#1a3d34",
    accentSoft: "#f2ebe0",
    tableHead: "#f8f4ec",
  },
  blue: {
    id: "blue",
    label: "Blue",
    accent: "#1d4ed8",
    accentSoft: "#eff6ff",
    tableHead: "#f1f5f9",
  },
  slate: {
    id: "slate",
    label: "Slate",
    accent: "#475569",
    accentSoft: "#f8fafc",
    tableHead: "#f1f5f9",
  },
  teal: {
    id: "teal",
    label: "Teal",
    accent: "#0f766e",
    accentSoft: "#f0fdfa",
    tableHead: "#f1f5f9",
  },
  navy: {
    id: "navy",
    label: "Navy",
    accent: "#1e3a5f",
    accentSoft: "#f8fafc",
    tableHead: "#f1f5f9",
  },
  maroon: {
    id: "maroon",
    label: "Maroon",
    accent: "#9f1239",
    accentSoft: "#fff1f2",
    tableHead: "#f8fafc",
  },
  charcoal: {
    id: "charcoal",
    label: "Charcoal",
    accent: "#27272a",
    accentSoft: "#fafafa",
    tableHead: "#f4f4f5",
  },
};

/** @deprecated Use DOCUMENT_PRESET_IDS */
export const DOCUMENT_THEME_IDS = DOCUMENT_PRESET_IDS;

/** @deprecated Use DocumentPresetId */
export type DocumentThemeId = DocumentPresetId;

export function normalizeHexColor(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  let hex = value.trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    const c = hex.slice(1);
    hex = `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
  return hex.toLowerCase();
}

function softTintFromHex(hex: string): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c * 0.1 + 255 * 0.9);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function buildCustomTheme(accent: string): DocumentThemeTokens {
  return {
    id: "custom",
    label: "Custom",
    accent,
    accentSoft: softTintFromHex(accent),
    tableHead: "#f1f5f9",
  };
}

export function parseStoredDocumentTheme(
  value: string | null | undefined,
): DocumentStoredThemeId {
  if (value === "custom") return "custom";
  if (value && value in DOCUMENT_THEME_PRESETS) {
    return value as DocumentPresetId;
  }
  return DEFAULT_DOCUMENT_THEME;
}

/** @deprecated Use parseStoredDocumentTheme */
export function parseDocumentTheme(value: string | null | undefined): DocumentPresetId {
  const stored = parseStoredDocumentTheme(value);
  if (stored === "custom") return DEFAULT_DOCUMENT_THEME;
  return stored;
}

export function getDocumentTheme(
  theme: string | null | undefined,
  customAccent?: string | null,
): DocumentThemeTokens {
  const stored = parseStoredDocumentTheme(theme);
  if (stored === "custom") {
    const accent =
      normalizeHexColor(customAccent) ?? DEFAULT_CUSTOM_ACCENT;
    return buildCustomTheme(accent);
  }
  return DOCUMENT_THEME_PRESETS[stored];
}
