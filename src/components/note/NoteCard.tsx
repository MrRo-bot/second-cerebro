import Link from "next/link";
import { MouseEvent, TransitionStartFunction } from "react";
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

import { capitalizeTag, renderToast } from "@/lib/utils";

import { togglePinNoteAction } from "@/actions/note.action";

import { NoteType } from "@/types/note";

const NoteCard = ({
  noteData,
  isPending,
  startTransition,
  addOptimisticNote,
}: {
  noteData: NoteType;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  addOptimisticNote: (action: {
    noteId: string;
    newPinnedState: boolean;
  }) => void;
}) => {
  const { _id, title, content, tags, isPinned } = noteData;

  // optimistic pinning
  const handleTogglePin = async (
    e: MouseEvent,
    noteId: string,
    currentPinned: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      addOptimisticNote({ noteId, newPinnedState: !currentPinned });
      const result = await togglePinNoteAction(noteId, currentPinned);

      if (result.status === "error") {
        console.error(result.message);
        renderToast({
          status: "error",
          message: `Logout Failed: ${result.message}`,
        });
      }
    });
  };

  return (
    <Card className="group relative h-full flex-col flex justify-between overflow-visible hover:ring-2 focus:ring-2 focus-visible:ring-2 transition rounded-md! py-3!">
      <Link
        className="absolute inset-0 inline-block bg-transparent z-5"
        href={`dashboard/${_id}`}
      />

      <Button
        variant="secondary"
        disabled={isPending}
        onClick={(e) => handleTogglePin(e, _id, isPinned)}
        className="group-hover:opacity-100 group-focus-visible:opacity-100 group-focus:opacity-100 group-hover:visible group-focus-visible:visible group-focus:visible invisible opacity-0 absolute transition cursor-pointer -left-3 -top-3 p-2 rounded-full z-100"
      >
        <PushPinIcon weight={isPinned ? "fill" : "bold"} />
      </Button>

      <Button
        variant="secondary"
        onClick={() => {}}
        className="group-hover:opacity-100 group-focus-visible:opacity-100 group-focus:opacity-100 group-hover:visible group-focus-visible:visible group-focus:visible invisible opacity-0 absolute transition cursor-pointer -right-3 -top-3 p-2 rounded-full z-100"
      >
        <CheckSquareIcon weight="bold" />
      </Button>

      <CardHeader>
        <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 overflow-hidden text-ellipsis w-11/12">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="w-11/12 line-clamp-4 overflow-hidden text-ellipsis mb-auto">
        {/* rendering markdown */}
        <MarkdownRenderer content={content} />
      </CardContent>

      <CardFooter className="border-none! py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-sm! text-secondary-foreground/50 pt-1"
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
