"use client";

import type { DocumentVisibilityKey } from "@/lib/document-visibility";
import { VISIBILITY_FIELD_META } from "@/lib/document-visibility";
import { cn } from "@/lib/utils";

type Props = {
  keys: DocumentVisibilityKey[];
  values: Record<DocumentVisibilityKey, boolean>;
  onChange: (key: DocumentVisibilityKey, enabled: boolean) => void;
  className?: string;
};

export function DocumentVisibilityToggles({
  keys,
  values,
  onChange,
  className,
}: Props) {
  if (keys.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/25 px-3 py-3",
        className,
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">
        Show on quotation &amp; invoice PDF
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {keys.map((key) => {
          const meta = VISIBILITY_FIELD_META[key];
          const checked = values[key];
          return (
            <label
              key={key}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                checked
                  ? "border-primary/30 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              <input
                type="checkbox"
                className="size-3.5 rounded border-input accent-primary"
                checked={checked}
                onChange={(e) => onChange(key, e.target.checked)}
              />
              <span className="font-medium">{meta.label}</span>
              <span className="text-[10px] opacity-70">
                {meta.scope === "invoice" ? "Invoice" : "Both"}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
