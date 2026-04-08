"use client";

import { useActionState, useEffect, useOptimistic, useRef } from "react";
import {
  PaperPlaneTiltIcon,
  RobotIcon,
  SparkleIcon,
  SpinnerBallIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

import { AIRagAction } from "@/actions/ai.action";
import { useSession } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";
import Form from "next/form";

const AIChat = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending: isSessionPending } = useSession();

  const [state, formAction, isPending] = useActionState(AIRagAction, {
    status: "success",
    message: "",
    response: [],
  });

  useEffect(() => {
    if (state?.message)
      renderToast({
        status: state?.status,
        message: state?.message,
      });
  }, [state]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    state?.response,
    (current, newMessage: string) => {
      return [
        ...current,
        { role: "user", content: newMessage },
        { role: "assistant", content: "Searching your knowledge base..." },
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
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [optimisticMessages]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-xl z-50 h-12 w-12 cursor-pointer"
        >
          <SparkleIcon weight="duotone" className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg flex items-center gap-2">
            AI Knowledge Assistant{" "}
          </SheetTitle>
          <SheetDescription className="sr-only hidden">
            limited use chat bot
          </SheetDescription>
        </SheetHeader>

        <Card className="h-full">
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea ref={scrollRef} className="h-full px-2">
              {/* generating chats with AI */}

              {optimisticMessages?.length ? (
                optimisticMessages?.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
                        className={`p-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-muted text-foreground border"
                        }`}
                      >
                        <MarkdownRenderer content={msg.content} />
                      </div>
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

          <CardFooter className="p-3 border-t flex flex-col justify-center items-center">
            <Form
              ref={formRef}
              action={handleAction}
              className="flex w-full gap-2 bg-background/50 backdrop-blur"
            >
              <Input
                name="prompt"
                id="prompt"
                placeholder="Search within your Knowledge Base..."
                className="h-9 text-sm focus-visible:ring-1"
                disabled={isPending}
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="size-9 p-0 cursor-pointer"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerBallIcon
                      weight="bold"
                      className="size-4 animate-spin"
                    />
                  </div>
                ) : (
                  <PaperPlaneTiltIcon weight="bold" className="size-4" />
                )}
              </Button>
            </Form>
          </CardFooter>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default AIChat;
