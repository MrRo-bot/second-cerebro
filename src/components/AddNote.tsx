"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CancelButton from "@/components/CancelButton";

import { addNoteAction } from "@/actions/note.action";
import { renderToast } from "@/lib/utils";

const AddNote = () => {
  const [state, action, pending] = useActionState(addNoteAction, undefined);
  const noteFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state)
      renderToast({
        status: state?.status,
        message: state?.message,
      });
  }, [state]);

  return (
    <>
      <Form
        ref={noteFormRef}
        className="flex flex-col items-between gap-3 w-max"
        action={action}
      >
        <h2 className="text-center my-2">Add Note</h2>
        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="title">
            Title:
          </Label>
          <Input id="title" name="title" type="text" />
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-4">
          <Label className="text-xl" htmlFor="content">
            Content:
          </Label>
          <Input id="content" name="content" type="text" />
        </div>
        <div className="flex gap-2 items-center justify-center mx-auto w-max">
          <Button
            type="submit"
            className="cursor-pointer mx-auto w-max block"
            variant="destructive"
            disabled={pending}
          >
            {pending ? "ADDING..." : "ADD"}
          </Button>
          <CancelButton ref={noteFormRef} />
        </div>
      </Form>
    </>
  );
};

export default AddNote;
