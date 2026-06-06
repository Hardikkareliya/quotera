"use client";

import { Search, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DocumentListToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder: string;
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  entityLabel: string;
  deleteLabel: string;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  deletePending: boolean;
};

export function DocumentListToolbar({
  query,
  onQueryChange,
  searchPlaceholder,
  filteredCount,
  totalCount,
  selectedCount,
  entityLabel,
  deleteLabel,
  onDeleteSelected,
  onClearSelection,
  deletePending,
}: DocumentListToolbarProps) {
  const hasFilter = query.trim().length > 0;

  return (
    <div className="space-y-3 border-b border-border/60 px-4 py-3 md:px-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 pl-9 pr-9"
          aria-label={searchPlaceholder}
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-8 flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          {hasFilter ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">{filteredCount}</span>{" "}
              of {totalCount}
            </>
          ) : (
            <>
              <span className="font-medium text-foreground">{totalCount}</span>{" "}
              {totalCount === 1 ? entityLabel : `${entityLabel}s`}
            </>
          )}
        </p>

        {selectedCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">
              {selectedCount} selected
            </span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={deletePending}
              onClick={onDeleteSelected}
            >
              <Trash2 className="size-4" />
              {deleteLabel}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={deletePending}
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
