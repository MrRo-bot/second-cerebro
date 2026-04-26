import Link from "next/link";
import { CheckSquareIcon, PushPinIcon } from "@phosphor-icons/react";
import { format, formatRelative } from "date-fns";

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
  const { _id, title, content, createdAt, updatedAt, tags } = noteData;
  return (
    <Card className="relative h-full flex-col flex justify-between overflow-visible hover:ring-2 focus-visible:ring-2">
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
        <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-5/6">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="w-5/6 line-clamp-4 text-ellipsis mb-auto">
        {/* rendering markdown */}
        <MarkdownRenderer content={content} />
      </CardContent>

      <CardFooter className="py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
        <p>created: {format(createdAt, "do 'of' MMMM 'at' HH:MM aa")}</p>
        <p>updated: {formatRelative(updatedAt, new Date())}</p>

        <div className="flex gap-1 flex-wrap">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="rounded-full pt-1">
              {capitalizeTag(tag)}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
