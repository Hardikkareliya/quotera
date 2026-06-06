import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        draft: "border-transparent bg-muted text-muted-foreground",
        sent: "border-transparent bg-blue-100 text-blue-800",
        paid: "border-transparent bg-green-100 text-green-800",
        partial: "border-transparent bg-amber-100 text-amber-800",
        overdue: "border-transparent bg-red-100 text-red-800",
        cancelled: "border-transparent bg-slate-200 text-slate-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
