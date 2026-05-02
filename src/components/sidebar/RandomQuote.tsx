"use client";

import { QuotesIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { quoteCategories } from "@/lib/utils";

const RandomQuote = ({ isOpen }: { isOpen: boolean }) => {
  const [quote, setQuote] = useState<{
    quote: string;
    author: string;
    work: string;
    categories: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_NINJA_QUOTES_API_KEY;

      if (apiKey) {
        const randomIndex = Math.floor(Math.random() * quoteCategories.length);
        const randomCategory = quoteCategories[randomIndex];

        const url = `https://api.api-ninjas.com/v2/randomquotes?category=${randomCategory}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "X-Api-Key": apiKey,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        if (data && data.length > 0) {
          setQuote(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Item
      style={{ display: isOpen ? "flex" : "none" }}
      variant="outline"
      className="p-2 hover:bg-accent-foreground/5"
    >
      <ItemMedia variant="icon">
        <QuotesIcon weight="bold" className="size-4" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="sr-only hidden">Random Quote</ItemTitle>
        <ItemDescription className="flex flex-col gap-2">
          <span className="text-white/90 font-semibold max-w-13rem">
            {quote?.quote ? quote?.quote : "Loading..."}
          </span>

          <span className="text-white/80 font-heading tracking-wider">
            {quote?.author ? "- " + quote?.author : "Loading..."}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default RandomQuote;
