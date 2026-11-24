import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

function clearSessionCookies(res: NextResponse) {
  for (const name of SESSION_COOKIE_NAMES) {
    res.cookies.delete(name);
  }
}

export const proxy = async (req: NextRequest) => {
  const { nextUrl } = req;

  if (
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/api") ||
    nextUrl.pathname.startsWith("/static") ||
    req.headers.get("next-router-prefetch") === "1"
  ) {
    return NextResponse.next();
  }

  let session = null;
  try {
    session = await auth.api.getSession({
      headers: req.headers,
      query:{disableCookieCache:true}
    });
  } catch {
    session = null;
  }

  const isLoggedIn = !!session;
  const isAuthPage = ["/login", "/register"].includes(nextUrl.pathname);
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

  // Only send logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    const safeTarget =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
    return NextResponse.redirect(new URL(safeTarget, req.url));
  }

  // Protect dashboard and clear any stale session cookie
  if (!isLoggedIn && isDashboardPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);

    if (!nextUrl.searchParams.has("message")) {
      loginUrl.searchParams.set("message", "Session expired. Please login again");
      loginUrl.searchParams.set("type", "error");
    }

    const res = NextResponse.redirect(loginUrl);
    clearSessionCookies(res);
    return res;
  }

  // If unauthenticated on /login, clean stale cookies without redirecting
  if (!isLoggedIn && isAuthPage) {
    const res = NextResponse.next();
    clearSessionCookies(res);
    return res;
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};