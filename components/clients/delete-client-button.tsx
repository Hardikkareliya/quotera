"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteClientAction } from "@/actions/clients";
import { Button } from "@/components/ui/button";

type Props = {
  clientId: string;
  clientName: string;
};

export function DeleteClientButton({ clientId, clientName }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${clientName}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(true);
    const result = await deleteClientAction(clientId);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Client deleted");
    router.replace("/clients");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      className="rounded-lg"
      disabled={pending}
      onClick={handleDelete}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
