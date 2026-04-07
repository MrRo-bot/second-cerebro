"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";
import {
  FloppyDiskBackIcon,
  PlusIcon,
  PlusSquareIcon,
} from "@phosphor-icons/react";

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
import { Badge } from "@/components/ui/badge";

import { renderToast } from "@/lib/utils";

import { addNoteAction } from "@/actions/note.action";

import { TiptapHandleType } from "@/types/types";

const AddNote = () => {
  const [state, action, pending] = useActionState(addNoteAction, undefined);
  const noteFormRef = useRef<HTMLFormElement>(null);

  // Creating the ref with the specific type
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
      }
    }
  }, [state]);

  const handleClear = () => {
    noteFormRef.current?.reset();
    tiptapRef.current?.clearContent();
  };

  // if user enters url for creating notes
  // const handleClip = async (url:string) => {
  //   const result = await WebSummaryAction(url);

  //   if (result.success && result.data) {
  //     const { title, summary, fullContent } = result.data;

  //     // Create a structured note for your Second Cerebro
  //     const editorContent = `
  //     <h1>${title}</h1>
  //     <div class="ai-summary" style="background: #f9fafb; padding: 10px; border-left: 4px solid #3b82f6;">
  //       ${summary}
  //     </div>
  //     <br />
  //     ${fullContent}
  //   `;

  //     editor?.commands.setContent(editorContent);
  //   }
  // };

  // if user uploads a pdf or doc (text based pdf and docs preferred)
  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

  //   const file = e.target.files?.[0];
  //   if (!file) return;

  // // Check size
  // if (file.size > MAX_FILE_SIZE) {
  //   alert("File is too large! Please upload a file smaller than 5MB.");
  //   e.target.value = ""; // Reset input
  //   return;
  // }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const result = await processFileAction(formData);

  //   if (result.status === "success" && result.response) {
  //     const { title, summary, content } = result.response;

  //     const finalHtml = `
  //       <h1>📄 ${title}</h1>
  //       <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 5px solid #2563eb;">
  //         <strong>Document Summary:</strong>
  //         ${summary}
  //       </div>
  //       <hr />
  //       ${content}
  //     `;

  //     editor.commands.setContent(finalHtml);
  //   }
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 justify-between w-max cursor-pointer items-center bg-sidebar dark:bg-sidebar-primary p-1">
          Add Note
          <PlusSquareIcon weight="duotone" className="size-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            <Badge
              variant="outline"
              className="rounded-full h-6 border-accent-foreground border-dashed border"
            >
              <PlusIcon weight="bold" data-icon="inline-start" />
              Verified
            </Badge>
          </DialogTitle>
          <DialogDescription className="sr-only hidden">
            Whats on your mind?
          </DialogDescription>
        </DialogHeader>
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
              initialContent="" // Important: start with empty string
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
