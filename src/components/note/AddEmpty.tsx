"use client";

import { useActionState, useEffect, useRef } from "react";
import Form from "next/form";
import { redirect } from "next/navigation";
import Tiptap from "@/components/tiptap/Tiptap";
import { FloppyDiskBackIcon } from "@phosphor-icons/react";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import FormErrorAlert from "@/components/FormErrorAlert";

import { renderToast } from "@/lib/utils";

import { addNoteAction } from "@/actions/note.action";

import { TiptapHandleType } from "@/types/types";

const AddEmpty = () => {
  const [state, action, pending] = useActionState(addNoteAction, undefined);
  const noteFormRef = useRef<HTMLFormElement>(null);
  const tiptapRef = useRef<TiptapHandleType>(null);

  useEffect(() => {
    if (state) {
      renderToast({
        status: state?.status,
        message: state?.message,
      });

      // Reset form after successful submission
      if (state.status === "success") {
        noteFormRef.current?.reset();
        tiptapRef.current?.clearContent();
        redirect("/dashboard");
      }
    }
  }, [state]);

  const handleClear = () => {
    noteFormRef.current?.reset();
    tiptapRef.current?.clearContent();
  };

  return (
    <Card className="gap-1 p-0">
      <CardHeader>
        <CardTitle className="sr-only hidden">Empty Note</CardTitle>
        <CardDescription className="sr-only hidden">
          View your key metrics and recent project activity. Track progress
          across all your active projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground px-0">
        {/* adding note with traditional way */}
        <Form ref={noteFormRef} action={action}>
          <FieldGroup>
            <Label className="text-xl sr-only hidden" htmlFor="title">
              Title:
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Untitled"
              className="px-1 bg-transparent! text-lg! tracking-wide font-bold border-none focus-visible:ring-0 placeholder:font-bold placeholder:text-lg placeholder:tracking-wide"
            />
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
              initialContent="" // Important: starts with empty string
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
              {pending ? "ADDING..." : "ADD NOTE"}
              <FloppyDiskBackIcon weight="bold" className="size-4" />
            </Button>
          </DialogFooter>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEmpty;
