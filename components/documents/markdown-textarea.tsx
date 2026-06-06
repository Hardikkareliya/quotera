"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MarkdownTextareaProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rows?: number;
  compact?: boolean;
};

export function MarkdownTextarea({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  compact = false,
}: MarkdownTextareaProps) {
  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {compact ? "Details (optional)" : "Sub-description (optional)"}
      </Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder ?? "Enter description"}
        className={
          compact
            ? "min-h-0 resize-y text-sm leading-snug"
            : "min-h-[96px] text-sm leading-relaxed"
        }
      />
    </div>
  );
}
