"use client";

import { useEffect, useMemo, useState } from "react";

import {
  filterDocumentList,
  type DocumentListSearchable,
} from "@/lib/document-list-search";
import {
  DEFAULT_DOCUMENT_LIST_PAGE_SIZE,
  paginateDocumentList,
  type DocumentListPageSize,
} from "@/lib/document-list-pagination";

export function useDocumentListControls<T extends DocumentListSearchable>(
  items: T[],
) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<DocumentListPageSize>(
    DEFAULT_DOCUMENT_LIST_PAGE_SIZE,
  );

  const filtered = useMemo(
    () => filterDocumentList(items, query),
    [items, query],
  );

  const pagination = useMemo(
    () => paginateDocumentList(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  const pageItems = pagination.items;

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination.totalPages]);

  const selectedCount = selectedIds.size;
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((item) => selectedIds.has(item.id));
  const somePageSelected =
    pageItems.some((item) => selectedIds.has(item.id)) && !allPageSelected;

  function handleQueryChange(value: string) {
    setQuery(value);
  }

  function handlePageSizeChange(size: DocumentListPageSize) {
    setPageSize(size);
    setPage(1);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        for (const item of pageItems) next.delete(item.id);
      } else {
        for (const item of pageItems) next.add(item.id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function getSelectedIds(): string[] {
    return [...selectedIds];
  }

  function isSelected(id: string) {
    return selectedIds.has(id);
  }

  return {
    query,
    setQuery: handleQueryChange,
    filtered,
    pageItems,
    selectedCount,
    allPageSelected,
    somePageSelected,
    toggleOne,
    toggleAllOnPage,
    clearSelection,
    getSelectedIds,
    isSelected,
    page: pagination.page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages: pagination.totalPages,
    filteredCount: pagination.totalItems,
    rangeStart: pagination.rangeStart,
    rangeEnd: pagination.rangeEnd,
  };
}
