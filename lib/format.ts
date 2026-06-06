import { formatINR, parseDecimalToPaise } from "@/lib/money";

export function formatMoney(amount: string | number): string {
  return formatINR(parseDecimalToPaise(String(amount)));
}

/** Date-only strings (YYYY-MM-DD) from the database. */
export function formatShortDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
