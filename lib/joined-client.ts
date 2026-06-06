export function clientNameFromJoin(
  clients: { name: string } | { name: string }[] | null | undefined,
): string {
  if (!clients) return "—";
  if (Array.isArray(clients)) return clients[0]?.name ?? "—";
  return clients.name ?? "—";
}
