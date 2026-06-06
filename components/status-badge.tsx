import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<
  string,
  "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled" | "secondary"
> = {
  draft: "draft",
  sent: "sent",
  accepted: "paid",
  rejected: "cancelled",
  expired: "overdue",
  partially_paid: "partial",
  paid: "paid",
  overdue: "overdue",
  cancelled: "cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] ?? "secondary";
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
}
