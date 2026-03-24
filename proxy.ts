import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  // Skip prefetch requests (common source of issues in production)
  if (req.headers.get("next-router-prefetch") === "1") {
    return NextResponse.next();
  }

  // Checking for the Better Auth session cookie (handles both dev and prod prefixes)
  const sessionCookie =
    req.cookies.get("better-auth.session_token") ||
    req.cookies.get("__Secure-better-auth.session_token") ||
    req.cookies.get("_Secure-better-auth.session_token");

  // If no cookie → redirect to login
  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("/dashboard", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists → allow the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
