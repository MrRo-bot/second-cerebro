"use client";

import { deleteNoteAction } from "@/actions/note.action";
import { Button } from "./ui/button";
import { TrashIcon } from "@phosphor-icons/react";

const DeleteNote = ({ id }: { id: string }) => {
  return (
    <Button
      variant="destructive"
      className="cursor-pointer"
      onClick={async () => {
        if (confirm("Are you sure?")) {
          await deleteNoteAction(id);
        }
      }}
    >
      <TrashIcon />
    </Button>
  );
};

export default DeleteNote;
