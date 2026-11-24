
import { quoteCategories } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NINJA_QUOTES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const randomCategory =
    quoteCategories[Math.floor(Math.random() * quoteCategories.length)];

  const res = await fetch(
    `https://api.api-ninjas.com/v2/randomquotes?category=${randomCategory}`,
    {
      headers: { "X-Api-Key": apiKey },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream error: ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}