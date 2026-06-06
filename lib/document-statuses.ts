export const QUOTATION_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent to client" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
] as const;

export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent to client" },
  { value: "partially_paid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
] as const;

/** Compact labels for list table status dropdowns. */
export const INVOICE_LIST_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  partially_paid: "Partial",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const QUOTATION_LIST_STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};
