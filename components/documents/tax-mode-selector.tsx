"use client";

import { TAX_MODE_OPTIONS, type TaxMode } from "@/lib/tax-mode";
import { cn } from "@/lib/utils";

type TaxModeSelectorProps = {
  value: TaxMode;
  onChange: (value: TaxMode) => void;
  disabled?: boolean;
};

export function TaxModeSelector({
  value,
  onChange,
  disabled,
}: TaxModeSelectorProps) {
  const active = TAX_MODE_OPTIONS.find((o) => o.value === value);

  return (
    <div className="space-y-2">
      <div
        className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-muted/30 p-1"
        role="group"
        aria-label="Tax type"
      >
        {TAX_MODE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors sm:px-4",
              value === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {active?.hint ?? "Choose how tax appears on PDF"}
      </p>
    </div>
  );
}
