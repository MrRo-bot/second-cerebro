"use client";

import { QuotesIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import { normalizeError, renderToast } from "@/lib/utils";

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
      const res = await fetch("/api/random-quote");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      
      const data = await res.json();
      if (data && data.length > 0) {
        setQuote(data[0]);
      }
    } catch (error) {
      console.error("Error fetching quote: ", JSON.stringify(error));
      const info = normalizeError(error);
      renderToast({
        status: "error" as const,
        message: info.message || "Error fetching quote",
        ...(process.env.NODE_ENV !== "production" && { debug: info }),
      });
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
          <span className="text-black/90 dark:text-white/90 font-semibold max-w-13rem">
            {/* //TODO: ONLY LOADING AND QUOTE STATE NO ERROR STATE IN FRONTEND */}
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

          <span className="text-black dark:text-white/80 font-heading tracking-wider">
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
