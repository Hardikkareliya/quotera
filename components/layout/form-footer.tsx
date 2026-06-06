"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  cancelHref: string;
  submitLabel: string;
  pending?: boolean;
};

export function FormFooter({ cancelHref, submitLabel, pending }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-5">
      <Button type="button" variant="outline" className="rounded-lg" asChild>
        <Link href={cancelHref}>Cancel</Link>
      </Button>
      <Button type="submit" className="min-w-[120px] rounded-lg" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </div>
  );
}
