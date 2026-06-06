"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  message?: string;
  retry?: () => void;
};

export function PageError({
  title = "Something went wrong",
  message = "We could not load this page. Please try again.",
  retry,
}: Props) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[20px] bg-card p-10 text-center shadow-card">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" />
      </div>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {retry ? (
        <Button className="mt-6 rounded-xl" onClick={retry}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      ) : (
        <Button
          className="mt-6 rounded-xl"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="size-4" />
          Reload page
        </Button>
      )}
    </div>
  );
}
