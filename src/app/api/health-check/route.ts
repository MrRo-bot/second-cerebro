import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  return NextResponse.json({ status: "ok" });
};

export const HEAD = async () => {
  return new NextResponse(null, { status: 200 });
};
