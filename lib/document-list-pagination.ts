export const DOCUMENT_LIST_PAGE_SIZES = [10, 15, 25] as const;
export type DocumentListPageSize = (typeof DOCUMENT_LIST_PAGE_SIZES)[number];

export const DEFAULT_DOCUMENT_LIST_PAGE_SIZE: DocumentListPageSize = 15;

export type DocumentListPaginationResult<T> = {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
};

export function paginateDocumentList<T>(
  items: T[],
  page: number,
  pageSize: number,
): DocumentListPaginationResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems,
    rangeStart: totalItems === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, totalItems),
  };
}

/** Page buttons with ellipsis for long lists. */
export function getDocumentListPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && prev !== undefined && p - prev > 1) result.push("ellipsis");
    result.push(p);
  }
  return result;
}
