"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  type: "quotation" | "invoice";
};

export function DocumentCreatedBanner({ type }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const created = searchParams.get("created") === "1";
  const saved = searchParams.get("saved") === "1";

  if (!created && !saved) return null;

  const label = type === "quotation" ? "Quotation" : "Invoice";

  function dismiss() {
    router.replace(pathname);
  }

  return (
    <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {created ? `${label} created successfully` : `${label} updated`}
        </p>
        <p className="mt-1 text-sm text-emerald-800/90">
          {created
            ? "Scroll down to view the PDF or send it to your client on WhatsApp or email."
            : "Your changes are saved. You can view the latest PDF below."}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
