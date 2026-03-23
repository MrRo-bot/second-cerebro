import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

//if any issues occur redirect to login page
export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
