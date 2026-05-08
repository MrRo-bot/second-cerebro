"use client";

import { QuotesIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

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
      className="p-2 hover:bg-accent-foreground/5 rounded-lg"
    >
      <ItemMedia variant="icon">
        <QuotesIcon weight="bold" className="size-4" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="sr-only hidden">Random Quote</ItemTitle>
        <div className="flex flex-col gap-2">
          <span className="text-white/90 font-semibold max-w-13rem">
            {quote?.quote && !loading ? (
              quote?.quote
            ) : (
              <div className="flex w-full max-w-xs flex-col gap-2">
                <Skeleton className="h-3 rounded-lg w-10/12" />
                <Skeleton className="h-3 rounded-lg w-11/12" />
                <Skeleton className="h-3 rounded-lg w-3/4" />
              </div>
            )}
          </span>

          <span className="text-white/80 font-heading tracking-wider">
            {quote?.author && !loading ? (
              quote?.author
            ) : (
              <Skeleton className="h-3 mt-2 rounded-lg w-1/2" />
            )}
          </span>
        </div>
      </ItemContent>
    </Item>
  );
};

export default RandomQuote;
