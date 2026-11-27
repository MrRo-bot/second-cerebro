import { quoteCategories } from "@/lib/utils";
import { NextResponse } from "next/server";

const FALLBACK_QUOTES = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    work: "",
    categories: ["inspiration"],
  },
  {
    quote: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    work: "",
    categories: ["motivation"],
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    work: "",
    categories: ["perseverance"],
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    work: "",
    categories: ["wisdom"],
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    work: "",
    categories: ["courage"],
  },
  {
    quote: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    work: "",
    categories: ["optimism"],
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    work: "",
    categories: ["action"],
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    work: "",
    categories: ["dreams"],
  },
];

function getRandomFallback() {
  return [FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]];
}

export async function GET() {
  const apiKey = process.env.NINJA_QUOTES_API_KEY;

  // Missing key → serve fallback (no 500, no toast)
  if (!apiKey) {
    return NextResponse.json(getRandomFallback());
  }

  const randomCategory =
    quoteCategories[Math.floor(Math.random() * quoteCategories.length)];

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v2/randomquotes?category=${randomCategory}`,
      {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) {
      // Rate-limited / upstream error → fall back instead of propagating error
      console.warn(`api-ninjas returned ${res.status}, using fallback quote`);
      return NextResponse.json(getRandomFallback());
    }

    const data = await res.json();

    // Ensure we always return an array the client expects
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data);
    }

    return NextResponse.json(getRandomFallback());
  } catch (err) {
    console.error("random-quote fetch failed:", err);
    // Network / unexpected error → still return a quote
    return NextResponse.json(getRandomFallback());
  }
}