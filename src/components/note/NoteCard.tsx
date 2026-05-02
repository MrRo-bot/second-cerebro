import Link from "next/link";
import { CheckSquareIcon, PushPinIcon } from "@phosphor-icons/react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";

import { capitalizeTag } from "@/lib/utils";

import { NoteType } from "@/types/note";

const NoteCard = ({ noteData }: { noteData: NoteType }) => {
  const { _id, title, content, tags } = noteData;
  return (
    <Card className="relative h-full flex-col flex justify-between overflow-visible hover:ring-2 focus-visible:ring-2 rounded-md! py-3!">
      <Link
        className="peer absolute inset-0 inline-block z-5"
        href={`dashboard/${_id}`}
      />

      <Button
        variant="secondary"
        onClick={() => {}}
        className="peer-hover:block peer-focus-visible:block peer-focus:block hidden absolute cursor-pointer -left-3 -top-3 p-2 rounded-full z-50"
      >
        <PushPinIcon weight="bold" />
      </Button>

      <Button
        variant="secondary"
        onClick={() => {}}
        className="peer-hover:block peer-focus-visible:block peer-focus:block hidden absolute cursor-pointer -right-3 -top-3 p-2 rounded-full z-50"
      >
        <CheckSquareIcon weight="bold" />
      </Button>

      <CardHeader>
        <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-11/12">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="w-11/12 line-clamp-4 text-ellipsis mb-auto">
        {/* rendering markdown */}
        <MarkdownRenderer content={content} />
      </CardContent>

      <CardFooter className="border-none! py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-sm! pb-1 pt-1.5 px-2 text-secondary-foreground/50"
            >
              {capitalizeTag(tag)}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
