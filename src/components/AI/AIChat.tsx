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
import Loader2 from "@/components/Loader2";

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
          className="fixed bottom-6 right-6 rounded-full z-50 size-12 cursor-pointer backdrop-blur-md dark:shadow-[0_2px_2px_rgba(155,155,155,0.2),0_0_4px_rgba(155,155,155,0.1)] shadow-[0_2px_2px_rgba(155,155,155,0.9),0_0_4px_rgba(155,155,155,0.8)]"
        >
          <div className="absolute inset-0 rounded-full z-47 blur-xs saturate-120 brightness-115"></div>
          <div className="absolute inset-0 rounded-full z-48 bg-white/5"></div>
          <div className="absolute inset-0 rounded-full z-49 shadow-[inset_1px_1px_0_rgba(255,255,255,0.15),inset_0_0_5px_rgba(255,255,255,0.25)]"></div>

          <SparkleIcon weight="duotone" className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex flex-col min-w-[30vw] z-250">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-50">
            AI Knowledge Assistant{" "}
          </SheetTitle>
          <SheetDescription className="sr-only hidden">
            limited use chat bot
          </SheetDescription>
        </SheetHeader>

        <Card className="h-full p-0 ring-0 bg-clip-padding bg-zinc-50/4 backdrop-blur-[48px] border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px]">
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
                      className={`relative flex gap-2 p-1 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {!isSessionPending ? (
                        <Avatar className="size-6 grid place-content-center border-[0.1px]! border-emerald-800!">
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
                      {isPending &&
                        msg.role === "assistant" &&
                        optimisticMessages.length - 1 === i && (
                          <div className="absolute -bottom-6 left-8">
                            <Loader2 text="Thinking" />
                          </div>
                        )}

                      <div
                        id="chat-head"
                        className={`relative p-2.5 text-sm mt-2 ${
                          msg.role === "user"
                            ? "font-semibold text-emerald-950 dark:text-emerald-300 bg-emerald-300/30 dark:bg-emerald-950/80 outline-1 outline-emerald-600/80"
                            : "text-emerald-950 dark:text-emerald-50 outline-1 outline-emerald-400/50 dark:outline-emerald-400/10"
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
                            className="rounded-full cursor-pointer text-emerald-600 hover:text-emerald-950! dark:text-emerald-400 dark:hover:text-emerald-100! transition-all duration-150 ease"
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
                        <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
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
        <SheetFooter className="relative p-2 border-t flex flex-col justify-center items-center bg-clip-padding bg-zinc-50/4 backdrop-blur-[48px] border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px]">
          {scrollToTop && (
            <Button
              size="lg"
              onClick={handleScrollToTop}
              className="absolute text-xs dark:font-semibold opacity-80 hover:opacity-100 hover:bg-sidebar-accent-foreground hover:shadow  backdrop-blur-xs left-1/2 -translate-x-1/2 -top-12 cursor-pointer rounded-full w-max pt-1 bg-theme-teal! text-zinc-950 dark:text-black hover:text-zinc-950/70 font-bold hover:dark:text-black/70 uppercase shadow-[0_0_10px]! shadow-theme-teal/50! hover:shadow-theme-teal! transition-all duration-150 ease"
            >
              <ArrowFatUpIcon weight="bold" className="size-3 mb-0.5" /> Scroll
              to Top
            </Button>
          )}
          {scrollToLatest && (
            <Button
              size="lg"
              onClick={handleScrollToLatest}
              className="absolute text-xs dark:font-semibold opacity-80 hover:opacity-100 hover:bg-sidebar-accent-foreground hover:shadow  backdrop-blur-xs left-1/2 -translate-x-1/2 -top-12 cursor-pointer rounded-full w-max pt-1 bg-theme-teal! text-zinc-950 dark:text-black hover:text-zinc-950/70 font-bold hover:dark:text-black/70 uppercase shadow-[0_0_10px]! shadow-theme-teal/50! hover:shadow-theme-teal! transition-all duration-150 ease"
            >
              <ArrowFatDownIcon weight="bold" className="size-3 mb-0.5" />{" "}
              Scroll to Latest
            </Button>
          )}
          <Form
            ref={formRef}
            action={handleAction}
            className="flex w-full gap-2 flex-col bg-transparent!"
          >
            {/* prompt suggestions */}
            <div className="flex gap-2 w-full overflow-x-auto no-scrollbar p-1">
              {promptSuggestions.map((text) => (
                <Badge
                  role="button"
                  key={text}
                  variant="secondary"
                  className="h-7 whitespace-nowrap rounded-full cursor-pointer w-max pt-1 bg-theme-teal/20! dark:bg-theme-teal/40! text-black dark:text-white hover:text-black/90 hover:dark:text-white/70  transition-all duration-150 ease shadow-[0_0_4px]! shadow-theme-teal/50! hover:shadow-theme-teal!"
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
              <div className="border-x-3 w-full border-theme-teal shadow-[10px_10px_20px_rgba(0,0,0,.24)] rounded-lg p-0.5">
                <Input
                  name="prompt"
                  id="prompt"
                  placeholder="Search within your Knowledge Base..."
                  className="h-9 text-sm focus-visible:ring-1 rounded-lg"
                  disabled={isPending}
                  onChange={(e) => setIsEmpty(e.target.value ? false : true)}
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending || isEmpty || isPendingTransition}
                className="size-9 p-0 cursor-pointer rounded-lg bg-theme-teal! text-theme-darkred dark:text-black hover:text-zinc-600 hover:dark:text-black/70 font-bold uppercase shadow-[0_0_10px]! shadow-theme-teal/50! hover:shadow-theme-teal!"
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
