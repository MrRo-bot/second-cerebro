"use client";

import Image from "next/image";
import { FolderPlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const EmptyPlaceholder = ({
  type,
  title,
  description,
}: {
  type: string;
  title: string;
  description: string;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="size-10 p-1">
          {(type === "note" && (
            <FolderPlusIcon weight="bold" className="size-8" />
          )) ||
            (type === "search" && (
              <MagnifyingGlassIcon weight="bold" className="size-8" />
            )) ||
            (type === "ai" && (
              <Image
                src="/logo.webp"
                alt="second-cerebro"
                width={32}
                height={32}
              />
            ))}
        </EmptyMedia>
        <EmptyTitle className="font-heading uppercase tracking-wide font-bold text-xl">
          {title || ""}
        </EmptyTitle>
        <EmptyDescription className="mt-2 text-lg">
          {description || ""}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyPlaceholder;
