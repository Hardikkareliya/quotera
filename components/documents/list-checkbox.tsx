"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export function ListCheckbox({
  checked,
  indeterminate,
  onChange,
  "aria-label": ariaLabel,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  "aria-label": string;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded border-input accent-primary",
        className,
      )}
    />
  );
}
