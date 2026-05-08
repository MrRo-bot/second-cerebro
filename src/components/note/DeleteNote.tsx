"use client";

import { redirect } from "next/navigation";
import { TrashIcon, WarningDiamondIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { renderToast } from "@/lib/utils";

import { deleteNoteAction } from "@/actions/note.action";

const DeleteNote = ({ id }: { id: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer rounded-lg">
          <TrashIcon weight="bold" className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg gap-2 text-destructive">
            <WarningDiamondIcon weight="bold" className="size-4" />
            Do you want to Delete this note?
          </DialogTitle>
          <DialogDescription>This action is irreversible!!!</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer rounded-lg pt-0.5"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer rounded-lg"
            onClick={async () => {
              const action = await deleteNoteAction(id);
              if (action)
                renderToast({
                  status: action?.status,
                  message: action?.message,
                });
              redirect("/dashboard");
            }}
            variant="destructive"
          >
            <TrashIcon weight="bold" className="size-4" /> Yes Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNote;
