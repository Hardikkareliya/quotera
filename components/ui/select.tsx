import * as React from "react";

import { cn } from "@/lib/utils";

function Select({
  className,
  fieldSize = "default",
  ...props
}: React.ComponentProps<"select"> & { fieldSize?: "default" | "compact" }) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex rounded-xl border border-input bg-white shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        fieldSize === "compact"
          ? "h-8 w-auto max-w-full px-2 py-0 text-xs"
          : "h-11 w-full px-3 py-1 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
