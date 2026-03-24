"use client";

import Form from "next/form";
import { useActionState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addNoteAction } from "@/actions/note.action";

const AddNote = () => {
  const [state, action, pending] = useActionState(addNoteAction, undefined);

  return (
    <>
      <Form
        className="flex flex-col items-between gap-3 w-max mx-auto"
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

        <Button
          type="submit"
          className="cursor-pointer mx-auto w-max block"
          variant="destructive"
          disabled={pending}
        >
          {pending ? "ADDING..." : "ADD"}
        </Button>
        {/* <Button
          className="cursor-pointer mx-auto w-max block"
          variant="destructive"
        >
          CANCEL
        </Button> */}
      </Form>
      <div>{state ? JSON.stringify(state) : "empty"}</div>
    </>
  );
};

export default AddNote;
