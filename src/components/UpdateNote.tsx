"use client";

import { useState } from "react";
import { PenIcon } from "@phosphor-icons/react";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";

import { updateNoteAction } from "@/actions/note.action";

const UpdateNote = ({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) => {
  const [fieldValues, setFieldValues] = useState({
    newTitle: { value: title, isUpdated: false },
    newContent: { value: content, isUpdated: false },
  });

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="secondary" className="cursor-pointer">
            <PenIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Update title or content</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={fieldValues.newTitle.value}
                onChange={(e) =>
                  setFieldValues((prev) => ({
                    ...prev,
                    newTitle: {
                      ...prev.newTitle,
                      value: e.target.value,
                      isUpdated: true,
                    },
                  }))
                }
              />
            </Field>
            <Field>
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                name="content"
                value={fieldValues.newContent.value}
                onChange={(e) =>
                  setFieldValues((prev) => ({
                    ...prev,
                    newContent: {
                      ...prev.newContent,
                      value: e.target.value,
                      isUpdated: true,
                    },
                  }))
                }
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                disabled={
                  !fieldValues.newTitle.isUpdated &&
                  !fieldValues.newContent.isUpdated
                }
                className="cursor-pointer"
                onClick={async () => {
                  await updateNoteAction(id, {
                    title: fieldValues.newTitle.isUpdated
                      ? fieldValues.newTitle.value
                      : "",
                    content: fieldValues.newContent.isUpdated
                      ? fieldValues.newContent.value
                      : "",
                  });
                }}
              >
                <PenIcon /> Yes Update
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default UpdateNote;
