"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={10000}
      richColors
      closeButton
      icons={{
        success: <CheckCircleIcon weight="bold" className="size-4" />,
        info: <InfoIcon weight="bold" className="size-4" />,
        warning: <WarningIcon weight="bold" className="size-4" />,
        error: <XCircleIcon weight="bold" className="size-4" />,
        loading: (
          <SpinnerIcon
            weight="bold"
            className="size-4 animate-spin origin-center "
          />
        ),
      }}
      toastOptions={{
        classNames: {
          // Base liquid glass look (applies to every toast)
          toast: cn(
            "group toast sm:!text-base !w-max !max-w-[30vw] !rounded-2xl !border !shadow-lg",
            // Glass effect
            "!backdrop-blur-xl !bg-background/55 dark:!bg-background/40",
            "!border-white/20 dark:!border-white/10",
            "!shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]",
            "ring-1 ring-inset ring-white/10",
          ),

          // Type-specific glass tints (this is what makes richColors look good)
          success: cn(
            "!bg-emerald-500/15 dark:!bg-emerald-500/20",
            "!border-emerald-500/30",
            "!text-emerald-900 dark:!text-emerald-100",
          ),
          error: cn(
            "!bg-red-500/15 dark:!bg-red-500/20",
            "!border-red-500/30",
            "!text-red-900 dark:!text-red-100",
          ),
          warning: cn(
            "!bg-amber-500/15 dark:!bg-amber-500/20",
            "!border-amber-500/30",
            "!text-amber-900 dark:!text-amber-100",
          ),
          info: cn(
            "!bg-sky-500/15 dark:!bg-sky-500/20",
            "!border-sky-500/30",
            "!text-sky-900 dark:!text-sky-100",
          ),

          title: "!font-medium !tracking-tight",
          description: "!text-[13px] !opacity-90",

          actionButton: cn(
            "!rounded-xl !backdrop-blur-md",
            "!bg-primary/90 !text-primary-foreground",
            "!border !border-white/20",
          ),
          cancelButton: cn(
            "!rounded-xl !backdrop-blur-md",
            "!bg-muted/60 !text-muted-foreground",
            "!border !border-white/10",
          ),
          closeButton: cn(
            "!rounded-full !backdrop-blur-md",
            "!bg-background/40 !border !border-white/15",
            "hover:!bg-background/60",
          ),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
