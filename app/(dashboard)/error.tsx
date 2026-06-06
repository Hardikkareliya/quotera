"use client";

import { useEffect } from "react";

import { PageError } from "@/components/error/page-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageError
      title="Dashboard error"
      message={error.message || "Something failed while loading this page."}
      retry={reset}
    />
  );
}
