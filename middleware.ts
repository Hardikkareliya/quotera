import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/clients",
  "/quotations",
  "/invoices",
  "/settings",
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => cookie.name.includes("-auth-token"));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Anonymous visitors on public pages — skip Supabase session work entirely.
  if (!hasSupabaseAuthCookie(request) && !isProtectedRoute(pathname)) {
    return NextResponse.next({ request });
  }

  // Protected routes without a session cookie — redirect immediately.
  if (!hasSupabaseAuthCookie(request) && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/dashboard/:path*",
    "/clients/:path*",
    "/quotations/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
