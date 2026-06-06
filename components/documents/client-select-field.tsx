"use client";

import { Plus, UserPlus } from "lucide-react";
import { useState, type MouseEvent } from "react";

import {
  ClientQuickAddDialog,
  type QuickAddedClient,
} from "@/components/clients/client-quick-add-dialog";
import { ClientPicker } from "@/components/documents/client-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type DocumentClientOption = QuickAddedClient;

type Props = {
  value: string;
  onChange: (clientId: string) => void;
  clients: DocumentClientOption[];
  onClientAdded: (client: DocumentClientOption) => void;
  defaultStateCode?: string;
  error?: string;
  className?: string;
};

export function ClientSelectField({
  value,
  onChange,
  clients,
  onClientAdded,
  defaultStateCode,
  error,
  className,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasClients = clients.length > 0;

  function openAddDialog(e?: MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    setDialogOpen(true);
  }

  function handleClientCreated(client: DocumentClientOption) {
    onClientAdded(client);
    onChange(client.id);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label className="mb-0">Client *</Label>
        {hasClients ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 gap-1 rounded-md px-2 text-xs text-primary hover:bg-primary/5"
            onClick={(e) => openAddDialog(e)}
          >
            <Plus className="size-3.5" />
            New client
          </Button>
        ) : null}
      </div>

      {hasClients ? (
        <ClientPicker
          value={value}
          onChange={onChange}
          clients={clients}
          onAddNew={() => openAddDialog()}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            No clients yet. Add one to create this document.
          </p>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="mt-3 rounded-lg"
            onClick={(e) => openAddDialog(e)}
          >
            <UserPlus />
            Add client
          </Button>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {dialogOpen ? (
        <ClientQuickAddDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultStateCode={defaultStateCode}
          onCreated={handleClientCreated}
        />
      ) : null}
    </div>
  );
}
