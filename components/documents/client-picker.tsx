"use client";

import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ClientPickerOption = {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Props = {
  value: string;
  onChange: (clientId: string) => void;
  clients: ClientPickerOption[];
  onAddNew: () => void;
  placeholder?: string;
  className?: string;
};

const SEARCH_MIN_CLIENTS = 2;

function clientSearchText(client: ClientPickerOption): string {
  return [client.name, client.company, client.email, client.phone]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function ClientPicker({
  value,
  onChange,
  clients,
  onAddNew,
  placeholder = "Select client",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const showSearch = clients.length >= SEARCH_MIN_CLIENTS;
  const selected = clients.find((c) => c.id === value);

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((client) => clientSearchText(client).includes(q));
  }, [clients, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    if (showSearch) {
      const t = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open, showSearch]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function selectClient(clientId: string) {
    onChange(clientId);
    setOpen(false);
  }

  function handleAddNew() {
    setOpen(false);
    onAddNew();
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-input bg-white px-3 text-left text-sm shadow-xs outline-none transition-colors",
          "hover:border-ring/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          open && "border-ring ring-[3px] ring-ring/50",
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate",
            selected ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {selected?.name ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Clients"
          className="absolute top-[calc(100%+0.375rem)] z-50 w-full overflow-hidden rounded-xl border border-border bg-card shadow-soft"
        >
          {showSearch ? (
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, company, email…"
                  className="h-9 pl-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredClients[0]) {
                      e.preventDefault();
                      selectClient(filteredClients[0].id);
                    }
                  }}
                />
              </div>
            </div>
          ) : null}

          <ul className="max-h-56 overflow-y-auto px-1.5 py-1.5">
            {filteredClients.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No clients match &ldquo;{query.trim()}&rdquo;
              </li>
            ) : (
              filteredClients.map((client) => {
                const isSelected = client.id === value;
                return (
                  <li key={client.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectClient(client.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-primary/5 font-medium text-primary"
                          : "text-foreground hover:bg-muted/60",
                      )}
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{client.name}</span>
                        {client.company?.trim() ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {client.company}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t border-border px-1.5 py-1.5">
            <button
              type="button"
              onClick={handleAddNew}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                <Plus className="size-4" />
              </span>
              Add new client
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
