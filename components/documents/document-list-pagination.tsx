"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  DOCUMENT_LIST_PAGE_SIZES,
  getDocumentListPageNumbers,
  type DocumentListPageSize,
} from "@/lib/document-list-pagination";
import { cn } from "@/lib/utils";

type DocumentListPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  pageSize: DocumentListPageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: DocumentListPageSize) => void;
  entityLabel: string;
};

export function DocumentListPagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  pageSize,
  onPageChange,
  onPageSizeChange,
  entityLabel,
}: DocumentListPaginationProps) {
  if (totalItems === 0) return null;

  const pageNumbers = getDocumentListPageNumbers(page, totalPages);
  const showPager = totalPages > 1;

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <p className="text-sm text-muted-foreground">
        {showPager ? (
          <>
            Showing{" "}
            <span className="font-medium text-foreground">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalItems}</span>{" "}
            {totalItems === 1 ? entityLabel : `${entityLabel}s`}
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{totalItems}</span>{" "}
            {totalItems === 1 ? entityLabel : `${entityLabel}s`}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Per page</span>
          <Select
            fieldSize="compact"
            value={String(pageSize)}
            onChange={(e) =>
              onPageSizeChange(Number(e.target.value) as DocumentListPageSize)
            }
            className="w-[4.25rem]"
            aria-label="Rows per page"
          >
            {DOCUMENT_LIST_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </label>

        {showPager ? (
          <nav
            className="flex items-center gap-1"
            aria-label="Pagination"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-0.5">
              {pageNumbers.map((item, index) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-muted-foreground"
                    aria-hidden
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    type="button"
                    variant={item === page ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "min-w-8 px-2",
                      item === page && "pointer-events-none",
                    )}
                    onClick={() => onPageChange(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </Button>
                ),
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
