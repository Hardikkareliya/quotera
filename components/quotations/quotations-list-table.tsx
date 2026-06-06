"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DocumentListPagination } from "@/components/documents/document-list-pagination";
import { DocumentListToolbar } from "@/components/documents/document-list-toolbar";
import { ListCheckbox } from "@/components/documents/list-checkbox";
import { useDocumentListControls } from "@/components/documents/use-document-list-controls";
import { DataPanel } from "@/components/layout/data-panel";
import type { ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/format";
import {
  QUOTATION_LIST_STATUS_LABEL,
  QUOTATION_STATUSES,
} from "@/lib/document-statuses";
import { cn } from "@/lib/utils";

export type QuotationListItem = {
  id: string;
  number: string;
  clientName: string;
  issueDate: string;
  total: string;
  status: string;
};

export type QuotationListActions = {
  updateStatus: (
    id: string,
    status: string,
  ) => Promise<ActionResult<void>>;
  deleteQuote: (id: string) => Promise<ActionResult<void>>;
  deleteMany: (ids: string[]) => Promise<ActionResult<{ deleted: number }>>;
};

function QuotationStatusSelect({
  id,
  currentStatus,
  updateStatus,
}: {
  id: string;
  currentStatus: string;
  updateStatus: QuotationListActions["updateStatus"];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function handleChange(next: string) {
    setStatus(next);
    if (next === currentStatus) return;

    setPending(true);
    const result = await updateStatus(id, next);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      setStatus(currentStatus);
      return;
    }

    toast.success("Status updated");
    router.refresh();
  }

  return (
    <div className="w-[7.25rem] shrink-0">
      <Select
        fieldSize="compact"
        value={status}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full"
        aria-label="Quotation status"
      >
        {QUOTATION_STATUSES.map((o) => (
          <option key={o.value} value={o.value}>
            {QUOTATION_LIST_STATUS_LABEL[o.value] ?? o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function QuotationDeleteButton({
  id,
  number,
  deleteQuote,
}: {
  id: string;
  number: string;
  deleteQuote: QuotationListActions["deleteQuote"];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete quotation ${number}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(true);
    const result = await deleteQuote(id);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Quotation deleted");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={pending}
      aria-label={`Delete ${number}`}
      onClick={handleDelete}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

export function QuotationsListTable({
  quotes,
  actions,
}: {
  quotes: QuotationListItem[];
  actions: QuotationListActions;
}) {
  const router = useRouter();
  const [bulkPending, setBulkPending] = useState(false);
  const {
    query,
    setQuery,
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
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredCount,
    rangeStart,
    rangeEnd,
  } = useDocumentListControls(quotes);

  async function handleBulkDelete() {
    const ids = getSelectedIds();
    if (!ids.length) return;

    const confirmed = window.confirm(
      `Delete ${ids.length} quotation${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setBulkPending(true);
    const result = await actions.deleteMany(ids);
    setBulkPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const deleted = result.data?.deleted ?? ids.length;
    toast.success(
      `${deleted} quotation${deleted === 1 ? "" : "s"} deleted`,
    );
    clearSelection();
    router.refresh();
  }

  const colSpan = 7;

  return (
    <DataPanel className="overflow-x-auto p-0">
      <DocumentListToolbar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search by number or client name…"
        filteredCount={filteredCount}
        totalCount={quotes.length}
        selectedCount={selectedCount}
        entityLabel="quotation"
        deleteLabel="Delete selected"
        onDeleteSelected={handleBulkDelete}
        onClearSelection={clearSelection}
        deletePending={bulkPending}
      />
      <Table className="min-w-[680px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-3">
              <ListCheckbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onChange={toggleAllOnPage}
                aria-label="Select all on this page"
              />
            </TableHead>
            <TableHead className="w-[7.5rem]">Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="w-[6.5rem]">Date</TableHead>
            <TableHead className="w-[6.5rem] text-right">Total</TableHead>
            <TableHead className="w-[7.5rem]">Status</TableHead>
            <TableHead className="w-[4.5rem] text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="py-12 text-center text-muted-foreground"
              >
                {query.trim()
                  ? `No quotations match “${query.trim()}”`
                  : "No quotations"}
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((q) => (
              <TableRow
                key={q.id}
                className={cn(
                  "border-border/40",
                  isSelected(q.id) && "bg-primary/5",
                )}
              >
                <TableCell className="px-3">
                  <ListCheckbox
                    checked={isSelected(q.id)}
                    onChange={() => toggleOne(q.id)}
                    aria-label={`Select ${q.number}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link
                    href={`/quotations/${q.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {q.number}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[12rem] truncate text-muted-foreground">
                  {q.clientName}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {q.issueDate}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right font-medium">
                  {formatMoney(q.total)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <QuotationStatusSelect
                    id={q.id}
                    currentStatus={q.status}
                    updateStatus={actions.updateStatus}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground hover:text-primary"
                    >
                      <Link
                        href={`/quotations/${q.id}`}
                        aria-label={`View ${q.number}`}
                      >
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <QuotationDeleteButton
                      id={q.id}
                      number={q.number}
                      deleteQuote={actions.deleteQuote}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DocumentListPagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        entityLabel="quotation"
      />
    </DataPanel>
  );
}
