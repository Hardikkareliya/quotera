import { headers } from "next/headers";

/** Public site origin (no trailing slash). Prefer NEXT_PUBLIC_SITE_URL. */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

/** Origin for the current request (SSR-safe; matches client hydration). */
export async function getRequestOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;

  return getSiteOrigin();
}

export function absoluteAppUrl(origin: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin.replace(/\/$/, "")}${normalized}`;
}

export function pdfDocumentUrl(
  origin: string,
  type: "quotation" | "invoice",
  id: string,
): string {
  return absoluteAppUrl(origin, `/api/pdf/${type}/${id}`);
}
