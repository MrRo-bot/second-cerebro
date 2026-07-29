import Link from "next/link";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TransitionStartFunction,
} from "react";
import { CheckSquareIcon, PushPinIcon } from "@phosphor-icons/react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";

import { renderToast } from "@/lib/utils";

import { togglePinNoteAction } from "@/actions/note.action";

import { NoteType } from "@/types/note";

const NoteCard = ({
  noteData,
  isPending,
  startTransition,
  addOptimisticNote,
  selectionList,
  setSelectionList,
}: {
  noteData: NoteType;
  isPending: boolean;
  startTransition: TransitionStartFunction;
  addOptimisticNote: (action: {
    noteId: string;
    newPinnedState: boolean;
  }) => void;
  selectionList: string[];
  setSelectionList: Dispatch<SetStateAction<string[]>>;
}) => {
  const { _id, title, content, tags, isPinned, updatedAt } = noteData;

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

  const handleSelection = () => {
    if (!selectionList.includes(_id)) {
      setSelectionList((prev) => [...prev, _id]);
    } else {
      setSelectionList((prev) => [...prev.filter((id) => id !== _id)]);
    }
  };

  return (
    <Card
      className={`group relative h-full flex-col flex justify-between overflow-visible hover:ring-3 focus:ring-3 focus-visible:ring-3 transition rounded-md! py-3! bg-zinc-100 dark:bg-gray-950 ${selectionList.includes(_id) && "ring-3! ring-theme-cyan! dark:ring-theme-red!"}`}
    >
      <Link
        className="absolute inset-0 inline-block bg-transparent z-5"
        href={`dashboard/${_id}`}
      />

      <Button
        disabled={isPending}
        onClick={(e) => handleTogglePin(e, _id, isPinned)}
        className="group-hover:opacity-60 group-focus-visible:opacity-60 group-focus:opacity-60 group-hover:visible group-focus-visible:visible group-focus:visible invisible opacity-0 absolute transition cursor-pointer -left-3 -top-3 p-2 rounded-full z-100"
      >
        <PushPinIcon weight={isPinned ? "fill" : "bold"} />
      </Button>

      <Button
        onClick={handleSelection}
        className="group-hover:opacity-60 group-focus-visible:opacity-60 group-focus:opacity-60 group-hover:visible group-focus-visible:visible group-focus:visible invisible opacity-0 absolute transition cursor-pointer -right-3 -top-3 p-2 rounded-full z-100"
      >
        <CheckSquareIcon
          weight={selectionList.includes(_id) ? "fill" : "bold"}
        />
      </Button>

      <CardHeader>
        <h3 className="text-base text-secondary-foreground uppercase font-heading font-black tracking-widest line-clamp-2 overflow-hidden text-ellipsis pl-4">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="relative">
        {/* rendering markdown */}
        <div className="absolute w-0.5 h-22 top-0.5 left-4 bg-theme-red dark:bg-theme-purple" />
        <div className="w-11/12 line-clamp-4 text-ellipsis text-sm dark:text-zinc-400 text-zinc-800 pl-4 mb-3">
          <MarkdownRenderer content={content} />
        </div>
      </CardContent>

      <CardFooter className="border-none! py-1 px-4 flex flex-col items-start justify-center">
        {tags && (
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-theme-red/50! dark:border-theme-cyan/20! uppercase dark:text-theme-cyan/80 text-theme-red text-shadow-[0_0_5px] dark:text-shadow-theme-cyan/40 text-shadow-theme-red/40 rounded-sm! pt-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="w-max text-theme-red dark:text-theme-purple text-[9px] font-semibold tracking-widest opacity-60 mt-4">
          {format(new Date(updatedAt), "PPp")}
        </p>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
