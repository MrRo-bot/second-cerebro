import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const { nextUrl } = req;

  //* Optimized exclude list
  if (
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/api") ||
    nextUrl.pathname.startsWith("/static") ||
    req.headers.get("next-router-prefetch") === "1"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies
    .getAll()
    .find((c) => c.name.includes("better-auth.session_token"));
  const isLoggedIn = !!sessionCookie?.value;

  const isAuthPage = ["/login", "/register"].includes(nextUrl.pathname);
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

  //* Redirect Logged-in users away from Auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  //* Protect Dashboard
  if (!isLoggedIn && isDashboardPage) {
    const loginUrl = new URL("/login", req.url);

    //* Preserve the original destination to redirect back after login
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);

    if (!nextUrl.searchParams.has("message")) {
      loginUrl.searchParams.set("message", "Please login to continue");
      loginUrl.searchParams.set("type", "error");
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export const config = {
  //* Using a negative lookahead to exclude files (favicons, etc.)
  //* while catching your main routes
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
