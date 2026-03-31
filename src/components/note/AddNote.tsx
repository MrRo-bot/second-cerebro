"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";
import { FloppyDiskBackIcon } from "@phosphor-icons/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap/Tiptap";

import { addNoteAction } from "@/actions/note.action";
import { renderToast } from "@/lib/utils";
import { TiptapHandle } from "@/types/types";

const AddNote = () => {
  const [state, action, pending] = useActionState(addNoteAction, undefined);
  const noteFormRef = useRef<HTMLFormElement>(null);

  //* Creating the ref with the specific type
  const tiptapRef = useRef<TiptapHandle>(null);

  useEffect(() => {
    if (state) {
      renderToast({
        status: state?.status,
        message: state?.message,
      });

      //* Reset form after successful submission
      if (state.status === "success") {
        noteFormRef.current?.reset();
        tiptapRef.current?.clearContent();
      }
    }
  }, [state]);

  const handleClear = () => {
    noteFormRef.current?.reset();
    tiptapRef.current?.clearContent();
  };

  return (
    <Form
      ref={noteFormRef}
      className="flex flex-col gap-3 w-max p-6"
      action={action}
    >
      <h2 className="text-center my-2">Add Note</h2>

      <div className="grid grid-cols-[1fr_3fr] gap-4">
        <Label className="text-xl" htmlFor="title">
          Title:
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Note title..."
          required
        />
      </div>

      <div className="grid grid-cols-[1fr_3fr] gap-4">
        <Label className="text-xl" htmlFor="content">
          Content:
        </Label>
        <Tiptap
          ref={tiptapRef}
          id="content"
          name="content"
          placeholder="What you want to note down..."
          initialContent="" //* Important: start with empty string
        />
      </div>

      <div className="flex gap-2 items-center justify-center mx-auto w-max mt-4">
        <Button
          type="submit"
          className="cursor-pointer flex gap-2"
          variant="destructive"
          disabled={pending}
        >
          {pending ? "ADDING..." : "ADD NOTE"}{" "}
          <FloppyDiskBackIcon weight="bold" className="size-4" />
        </Button>

        <Button
          onClick={handleClear}
          type="button"
          className="cursor-pointer mx-auto w-max block"
          variant="ghost"
        >
          CANCEL
        </Button>
      </div>
    </Form>
  );
};

export default AddNote;
