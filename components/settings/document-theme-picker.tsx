"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_CUSTOM_ACCENT,
  DOCUMENT_PRESET_IDS,
  DOCUMENT_THEME_PRESETS,
  normalizeHexColor,
  type DocumentStoredThemeId,
} from "@/lib/document-theme";
import { cn } from "@/lib/utils";

type Props = {
  theme: DocumentStoredThemeId;
  customAccent: string;
  onThemeChange: (value: DocumentStoredThemeId) => void;
  onCustomAccentChange: (value: string) => void;
};

export function DocumentThemePicker({
  theme,
  customAccent,
  onThemeChange,
  onCustomAccentChange,
}: Props) {
  const isCustom = theme === "custom";
  const customHex =
    normalizeHexColor(customAccent) ?? DEFAULT_CUSTOM_ACCENT;

  function selectCustom() {
    onThemeChange("custom");
    if (!normalizeHexColor(customAccent)) {
      onCustomAccentChange(DEFAULT_CUSTOM_ACCENT);
    }
  }

  function handleCustomHexInput(raw: string) {
    onCustomAccentChange(raw);
    if (theme !== "custom") onThemeChange("custom");
  }

  function handleColorPicker(hex: string) {
    onCustomAccentChange(hex);
    if (theme !== "custom") onThemeChange("custom");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DOCUMENT_PRESET_IDS.map((id) => {
          const preset = DOCUMENT_THEME_PRESETS[id];
          const selected = theme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onThemeChange(id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                selected
                  ? "border-foreground/30 bg-muted/50 ring-1 ring-foreground/15"
                  : "border-border bg-card hover:bg-muted/30",
              )}
            >
              <span
                className="size-8 shrink-0 rounded-md border border-black/5"
                style={{ backgroundColor: preset.accent }}
                aria-hidden
              />
              <span className="text-sm font-medium text-foreground">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "rounded-lg border p-4",
          isCustom
            ? "border-foreground/25 bg-muted/40 ring-1 ring-foreground/10"
            : "border-border bg-card",
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={selectCustom}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2 text-left",
              isCustom
                ? "border-foreground/30 bg-background"
                : "border-transparent hover:bg-muted/50",
            )}
          >
            <span
              className="size-8 shrink-0 rounded-md border border-black/10"
              style={{ backgroundColor: customHex }}
              aria-hidden
            />
            <span className="text-sm font-medium text-foreground">Custom</span>
          </button>

          <div className="flex flex-1 flex-wrap items-center gap-2 sm:min-w-[200px]">
            <Label htmlFor="doc-accent-picker" className="sr-only">
              Custom colour
            </Label>
            <input
              id="doc-accent-picker"
              type="color"
              value={customHex}
              onChange={(e) => handleColorPicker(e.target.value)}
              className="size-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
            />
            <Input
              value={customAccent}
              onChange={(e) => handleCustomHexInput(e.target.value)}
              placeholder={DEFAULT_CUSTOM_ACCENT}
              className="h-10 max-w-[120px] font-mono text-sm uppercase"
              spellCheck={false}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Pick any colour for headings, top bar, and total on quotations and
          invoices.
        </p>
      </div>
    </div>
  );
}
