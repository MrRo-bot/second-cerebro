import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  //* Skip prefetch requests to save resources
  if (req.headers.get("next-router-prefetch") === "1") {
    return NextResponse.next();
  }

  //* Better Auth session cookie check
  const sessionCookie =
    req.cookies.get("better-auth.session_token") ||
    req.cookies.get("__Secure-better-auth.session_token") ||
    req.cookies.get("_Secure-better-auth.session_token");

  const isLoggedIn = !!sessionCookie?.value;

  //* Defining path types
  //! NOTE: removed '/' so that people can access landing page
  const isAuthPage = ["/login", "/register"].includes(nextUrl.pathname);
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");

  //* If logged in, "no matter where i try to go" -> /dashboard
  //* Prevents logged-in users from seeing the landing, login, or register pages.
  if (isLoggedIn && isAuthPage) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    //* The searchParams are already on nextUrl, so cloning preserves them
    return NextResponse.redirect(dashboardUrl);
  }

  //* If NOT logged in -> /login
  //* Ensuring the dashboard remains private.
  if (!isLoggedIn && isDashboardPage) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    //* error if someone goes to dashboard without login
    if (!nextUrl.searchParams.has("message")) {
      loginUrl.searchParams.set("message", "Please login to continue");
      loginUrl.searchParams.set("type", "error");
    }

    //* The searchParams are already on nextUrl, so cloning preserves them
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

//* Ensuring the matcher includes all paths i want to control
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
