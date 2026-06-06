import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
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
