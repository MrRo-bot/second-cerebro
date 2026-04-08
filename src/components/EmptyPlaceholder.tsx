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
        <EmptyMedia variant="icon" className="size-8 p-1">
          {(type === "note" && (
            <FolderPlusIcon weight="bold" className="size-6" />
          )) ||
            (type === "search" && (
              <MagnifyingGlassIcon weight="bold" className="size-6" />
            )) ||
            (type === "ai" && (
              <Image
                src="/logo.webp"
                alt="second-cerebro"
                width={24}
                height={24}
              />
            ))}
        </EmptyMedia>
        <EmptyTitle className="font-heading uppercase tracking-wide font-bold">
          {title || ""}
        </EmptyTitle>
        <EmptyDescription>{description || ""}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyPlaceholder;
