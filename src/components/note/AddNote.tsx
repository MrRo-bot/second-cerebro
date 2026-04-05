"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";
import { FloppyDiskBackIcon, PlusSquareIcon } from "@phosphor-icons/react";

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
import { FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/tiptap/Tiptap";
import FormErrorAlert from "@/components/FormErrorAlert";

import { renderToast } from "@/lib/utils";

import { addNoteAction } from "@/actions/note.action";

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
    <Dialog>
      <DialogTrigger asChild>
        <PlusSquareIcon weight="duotone" className="size-6 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Note</DialogTitle>
          <DialogDescription>Whats on your mind?</DialogDescription>
        </DialogHeader>
        <Form ref={noteFormRef} action={action}>
          <FieldGroup>
            <Label className="text-xl sr-only hidden" htmlFor="title">
              Title:
            </Label>
            <Input id="title" name="title" type="text" placeholder="Title" />
            {state?.errors?.title && (
              <div className="col-start-2">
                <FormErrorAlert
                  status="error"
                  title="Validation Error"
                  description={state?.errors?.title}
                />
              </div>
            )}

            <Label className="text-xl sr-only hidden" htmlFor="content">
              Content:
            </Label>
            <Tiptap
              ref={tiptapRef}
              id="content"
              name="content"
              placeholder="What you want to note down?"
              initialContent="" //* Important: start with empty string
            />
            {state?.errors?.content && (
              <div className="col-start-2">
                <FormErrorAlert
                  status="error"
                  title="Validation Error"
                  description={state?.errors?.content}
                />
              </div>
            )}
          </FieldGroup>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button
                onClick={handleClear}
                type="button"
                className="cursor-pointer"
                variant="ghost"
              >
                CANCEL
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer flex gap-2"
              variant="destructive"
              disabled={pending}
            >
              {pending ? "ADDING..." : "ADD NOTE"}{" "}
              <FloppyDiskBackIcon weight="bold" className="size-4" />
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNote;
