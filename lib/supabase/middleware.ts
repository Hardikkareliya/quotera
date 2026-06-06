import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];
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

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;

  if (!url || !key) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Session read is local (JWT) — faster than getUser() on every navigation.
  // Server Components still call getUser() once per request for validation.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = isProtectedRoute(pathname);

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/dashboard?period=month", request.url),
    );
  }

  if (user && pathname === "/") {
    return NextResponse.redirect(
      new URL("/dashboard?period=month", request.url),
    );
  }

  if (
    user &&
    pathname === "/dashboard" &&
    !request.nextUrl.searchParams.get("period")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.set("period", "month");
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && !isPublic && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}
