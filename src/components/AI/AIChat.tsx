"use client";

import Form from "next/form";
import {
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  ArrowFatDownIcon,
  ArrowFatUpIcon,
  CopyIcon,
  PaperPlaneTiltIcon,
  RobotIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import CustomLoading from "@/components/CustomLoading";
import StreamingMessage from "./StreamingMessage";

import { AIRagAction } from "@/actions/ai.action";

import { useSession } from "@/lib/auth-client";
import { copyToClipboard, promptSuggestions, renderToast } from "@/lib/utils";

const AIChat = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const isAtBottom = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending: isSessionPending } = useSession();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [scrollToLatest, setScrollToLatest] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isPendingTransition, startTransition] = useTransition();

  const [state, formAction, isPending] = useActionState(AIRagAction, undefined);

  //sending toast for "other than success" messages
  useEffect(() => {
    if (state?.message)
      if (state?.message !== "Success")
        renderToast({
          status: state?.status,
          message: state?.message,
        });
  }, [state]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    state?.response ?? [],
    (current, newMessage: string) => {
      return [
        ...current,
        { role: "user" as const, content: newMessage },
        {
          role: "assistant" as const,
          content: "Searching your knowledge base...",
        },
      ];
    },
  );

  // adding action to form element because i needed useOptimistic
  const handleAction = async (formData: FormData) => {
    const msg = formData.get("prompt") as string;
    if (!msg?.trim()) return;

    addOptimisticMessage(msg);
    formRef.current?.reset();
    formAction(formData);
  };

  // Auto-scroll to end in chat section
  const handleScroll = () => {
    const container = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (!container) return;

    // Threshold of 50-100px for "near bottom"
    const threshold = 100;
    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    isAtBottom.current = distanceToBottom <= threshold;

    //make scroll to top button visible or not
    setScrollToTop(container.scrollTop > 100);
    setScrollToLatest(container.scrollTop < 10);
  };

  useEffect(() => {
    const handleAutoScroll = () => {
      if (!isAtBottom.current) return;

      const scrollContainer = scrollRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      );

      if (scrollContainer) {
        // scrollTo for a smoother experience or 'instant' for high-frequency updates
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "instant",
        });
      }
    };

    window.addEventListener("ai-stream-update", handleAutoScroll);
    return () =>
      window.removeEventListener("ai-stream-update", handleAutoScroll);
  }, []);

  //handler for scrolling to top
  const handleScrollToTop = () => {
    const container = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  //handler for scrolling to latest
  const handleScrollToLatest = () => {
    const container = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-xl z-50 size-12 cursor-pointer backdrop-blur-xs"
        >
          <SparkleIcon weight="duotone" className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex flex-col min-w-[30vw]">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg flex items-center gap-2">
            AI Knowledge Assistant{" "}
          </SheetTitle>
          <SheetDescription className="sr-only hidden">
            limited use chat bot
          </SheetDescription>
        </SheetHeader>

        <Card className="h-full p-0">
          <CardContent className="flex-1 overflow-hidden p-0 m-2">
            <ScrollArea
              onScrollCapture={handleScroll}
              ref={scrollRef}
              className="h-full scroll-auto"
            >
              {/* generating chats with AI */}

              {optimisticMessages?.length ? (
                optimisticMessages?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!isSessionPending ? (
                        <Avatar className="size-6 grid place-content-center">
                          {msg.role === "assistant" ? (
                            <RobotIcon weight="bold" className="size-4" />
                          ) : (
                            <AvatarImage
                              referrerPolicy="no-referrer"
                              src={
                                session?.user?.image ||
                                "https://github.com/shadcn.png"
                              }
                              alt={
                                session?.user?.username
                                  ?.slice(0, 2)
                                  .toUpperCase() || "shadcn"
                              }
                            />
                          )}
                        </Avatar>
                      ) : (
                        ""
                      )}
                      <div
                        id="chat-head"
                        className={`p-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-muted text-foreground border"
                        }`}
                      >
                        <StreamingMessage content={msg.content} />
                      </div>
                      <Tooltip>
                        <TooltipTrigger
                          className="cursor-pointer px-1.75 py-1.5"
                          asChild
                        >
                          <Button
                            className="rounded-full cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={(e) =>
                              copyToClipboard(
                                e?.currentTarget?.previousSibling?.textContent,
                              )
                            }
                          >
                            <CopyIcon className="size-4" weight="bold" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className=" flex items-center flex-col justify-center rounded-sm">
                          <p className="font-bold font-heading tracking-wider">
                            {msg.role === "user" && "Copy Prompt"}
                            {msg.role === "assistant" && "Copy Response"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyPlaceholder
                  type="ai"
                  title={`Hi 👋 ${session?.user?.name}`}
                  description={`Where should we start?`}
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <SheetFooter className="relative p-2 border-t flex flex-col justify-center items-center">
          {scrollToTop && (
            <Button
              size="lg"
              onClick={handleScrollToTop}
              className="absolute text-base opacity-80 hover:opacity-100 hover:bg-sidebar-accent-foreground hover:shadow hover:text-blue-900! hover:shadow-secondary-foreground backdrop-blur-xs left-1/2 -translate-x-1/2 -top-12 cursor-pointer rounded-full"
            >
              <ArrowFatUpIcon weight="bold" className="size-4" /> Scroll to Top
            </Button>
          )}
          {scrollToLatest && (
            <Button
              size="lg"
              onClick={handleScrollToLatest}
              className="absolute text-base opacity-80 hover:opacity-100 hover:bg-sidebar-accent-foreground hover:shadow hover:text-blue-900! hover:shadow-secondary-foreground backdrop-blur-xs left-1/2 -translate-x-1/2 -top-12 cursor-pointer rounded-full"
            >
              <ArrowFatDownIcon weight="bold" className="size-4" /> Scroll to
              Latest
            </Button>
          )}
          <Form
            ref={formRef}
            action={handleAction}
            className="flex w-full gap-2 backdrop-blur flex-col"
          >
            {/* prompt suggestions */}
            <div className="flex gap-2 w-full overflow-x-auto no-scrollbar py-1">
              {promptSuggestions.map((text) => (
                <Badge
                  role="button"
                  key={text}
                  variant="secondary"
                  className="h-7 whitespace-nowrap rounded-full cursor-pointer"
                  onClick={() => {
                    const data = new FormData();
                    data.set("prompt", text);
                    startTransition(async () => {
                      await handleAction(data);
                    });
                  }}
                >
                  {text}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                name="prompt"
                id="prompt"
                placeholder="Search within your Knowledge Base..."
                className="h-9 text-sm focus-visible:ring-1"
                disabled={isPending}
                onChange={(e) => setIsEmpty(e.target.value ? false : true)}
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isPending || isEmpty || isPendingTransition}
                className="size-9 p-0 cursor-pointer"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <CustomLoading className="scale-80" />
                  </div>
                ) : (
                  <PaperPlaneTiltIcon weight="bold" className="size-4" />
                )}
              </Button>
            </div>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AIChat;
