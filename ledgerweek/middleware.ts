import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const protectedPaths =
    p.startsWith("/dashboard") ||
    p.startsWith("/clients") ||
    p.startsWith("/deliverables") ||
    p.startsWith("/invoices") ||
    p.startsWith("/history") ||
    p.startsWith("/onboarding");

  if (!protectedPaths) return NextResponse.next();

  const authed = req.cookies.get("ledgerweek")?.value === "1";
  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*","/clients/:path*","/deliverables/:path*","/invoices/:path*","/history/:path*","/onboarding/:path*"],
};
