export type DocumentListSearchable = {
  id: string;
  number: string;
  clientName: string;
};

/** Client-side filter by document number or client name. */
export function filterDocumentList<T extends DocumentListSearchable>(
  items: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.number.toLowerCase().includes(q) ||
      item.clientName.toLowerCase().includes(q),
  );
}
