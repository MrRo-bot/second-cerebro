"use client";

import { useActionState, useEffect, useOptimistic, useRef } from "react";
import {
  BrainIcon,
  PaperPlaneTiltIcon,
  RobotIcon,
  SpinnerBallIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AIRagAction } from "@/actions/ai.action";
import { useSession } from "@/lib/auth-client";
import { renderToast } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

  //* adding action to form element because i needed useOptimistic
  const handleAction = async (formData: FormData) => {
    const msg = formData.get("prompt") as string;
    if (!msg?.trim()) return;

    addOptimisticMessage(msg);
    formRef.current?.reset();
    formAction(formData);
  };

  //* Auto-scroll to end in chat section
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [optimisticMessages]);

  return (
    <div className="flex items-center justify-center p-6">
      <Card className="w-100 h-125 flex flex-col shadow-lg border-muted">
        <CardHeader className="py-3 px-4 border-b bg-muted/20 flex justify-center items-center">
          <CardTitle className="text-sm font-medium">
            CHAT WITH YOUR KNOWLEDGE BASE
          </CardTitle>
          <BrainIcon weight="bold" className="size-4 text-rose-400" />
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea ref={scrollRef} className="h-full px-4">
            {/* generating chats with AI */}

            {optimisticMessages?.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!isSessionPending ? (
                    <Avatar className="w-6 h-6">
                      {msg.role === "assistant" ? (
                        <RobotIcon
                          weight="bold"
                          className="rounded-none size-4"
                        />
                      ) : (
                        <AvatarImage
                          className="rounded-none"
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
            ))}
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-3 border-t flex flex-col justify-center items-center">
          <form
            ref={formRef}
            action={handleAction}
            className="flex w-full gap-2 bg-background/50 backdrop-blur"
          >
            <Input
              name="prompt"
              id="prompt"
              placeholder="Search your knowledge..."
              className="h-9 text-sm focus-visible:ring-1"
              disabled={isPending}
              autoComplete="off"
            />
            <Button type="submit" disabled={isPending} className="h-9 w-9 p-0">
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
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIChat;
