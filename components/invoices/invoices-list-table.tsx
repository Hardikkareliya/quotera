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
  INVOICE_LIST_STATUS_LABEL,
  INVOICE_STATUSES,
} from "@/lib/document-statuses";
import { cn } from "@/lib/utils";

export type InvoiceListItem = {
  id: string;
  number: string;
  clientName: string;
  issueDate: string;
  total: string;
  amountPaid: string;
  status: string;
};

export type InvoiceListActions = {
  updateStatus: (
    id: string,
    status: string,
  ) => Promise<ActionResult<void>>;
  deleteInvoice: (id: string) => Promise<ActionResult<void>>;
  deleteMany: (ids: string[]) => Promise<ActionResult<{ deleted: number }>>;
};

function InvoiceStatusSelect({
  id,
  currentStatus,
  updateStatus,
}: {
  id: string;
  currentStatus: string;
  updateStatus: InvoiceListActions["updateStatus"];
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
        aria-label="Invoice status"
      >
        {INVOICE_STATUSES.map((o) => (
          <option key={o.value} value={o.value}>
            {INVOICE_LIST_STATUS_LABEL[o.value] ?? o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function InvoiceDeleteButton({
  id,
  number,
  deleteInvoice,
}: {
  id: string;
  number: string;
  deleteInvoice: InvoiceListActions["deleteInvoice"];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete invoice ${number}? Payments on this invoice will also be removed.`,
    );
    if (!confirmed) return;

    setPending(true);
    const result = await deleteInvoice(id);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Invoice deleted");
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

export function InvoicesListTable({
  invoices,
  actions,
}: {
  invoices: InvoiceListItem[];
  actions: InvoiceListActions;
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
  } = useDocumentListControls(invoices);

  async function handleBulkDelete() {
    const ids = getSelectedIds();
    if (!ids.length) return;

    const confirmed = window.confirm(
      `Delete ${ids.length} invoice${ids.length === 1 ? "" : "s"}? Linked payments will also be removed.`,
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
      `${deleted} invoice${deleted === 1 ? "" : "s"} deleted`,
    );
    clearSelection();
    router.refresh();
  }

  const colSpan = 8;

  return (
    <DataPanel className="overflow-x-auto p-0">
      <DocumentListToolbar
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search by number or client name…"
        filteredCount={filteredCount}
        totalCount={invoices.length}
        selectedCount={selectedCount}
        entityLabel="invoice"
        deleteLabel="Delete selected"
        onDeleteSelected={handleBulkDelete}
        onClearSelection={clearSelection}
        deletePending={bulkPending}
      />
      <Table className="min-w-[760px]">
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
            <TableHead className="w-[6rem] text-right">Paid</TableHead>
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
                  ? `No invoices match “${query.trim()}”`
                  : "No invoices"}
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((inv) => (
              <TableRow
                key={inv.id}
                className={cn(
                  "border-border/40",
                  isSelected(inv.id) && "bg-primary/5",
                )}
              >
                <TableCell className="px-3">
                  <ListCheckbox
                    checked={isSelected(inv.id)}
                    onChange={() => toggleOne(inv.id)}
                    aria-label={`Select ${inv.number}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {inv.number}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[12rem] truncate text-muted-foreground">
                  {inv.clientName}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {inv.issueDate}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right font-medium">
                  {formatMoney(inv.total)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-muted-foreground">
                  {formatMoney(inv.amountPaid)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <InvoiceStatusSelect
                    id={inv.id}
                    currentStatus={inv.status}
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
                        href={`/invoices/${inv.id}`}
                        aria-label={`View ${inv.number}`}
                      >
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <InvoiceDeleteButton
                      id={inv.id}
                      number={inv.number}
                      deleteInvoice={actions.deleteInvoice}
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
        entityLabel="invoice"
      />
    </DataPanel>
  );
}
