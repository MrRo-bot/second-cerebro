"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { PenIcon } from "@phosphor-icons/react";
import { marked } from "marked";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import Tiptap from "@/components/tiptap/Tiptap";
import DeleteNote from "@/components/note/DeleteNote";

import { renderToast } from "@/lib/utils";

import { updateNoteAction } from "@/actions/note.action";

type Props = {
  noteId: string;
  noteTitle: string;
  noteContent: string;
};

export default function UpdateNote({ noteId, noteTitle, noteContent }: Props) {
  const [title, setTitle] = useState(noteTitle);
  const [markdownContent, setMarkdownContent] = useState(noteContent);
  const [htmlContent, setHtmlContent] = useState(""); //* For Tiptap
  const [isConverting, setIsConverting] = useState(false);

  // Converting Markdown → HTML when opens / initialMarkdown changes
  useEffect(() => {
    (async () => {
      if (!noteContent) {
        setHtmlContent("");
        return;
      }

      setIsConverting(true);

      try {
        const html = await marked(noteContent, {
          breaks: true, //* Convert newlines to <br>
          gfm: true, //* GitHub Flavored Markdown (tables, task lists, etc.)
        });
        setHtmlContent(html);
      } catch (error) {
        renderToast({
          status: "error",
          message: "Markdown conversion failed: " + JSON.stringify(error),
        });
        setHtmlContent(noteContent); //* fallback to raw text
      } finally {
        setIsConverting(false);
      }
    })();
  }, [noteContent]);

  const hasChanges = title !== noteTitle || markdownContent !== noteContent;

  const handleUpdate = async () => {
    const updatePayload: { title?: string; content?: string } = {};

    if (title !== noteTitle) updatePayload.title = title;
    if (markdownContent !== noteContent)
      updatePayload.content = markdownContent;

    const state = await updateNoteAction(noteId, updatePayload);

    if (state) {
      renderToast({
        status: state.status,
        message: state.message,
      });
      redirect("/dashboard");
    }
  };

  return (
    <FieldGroup>
      <Field>
        <input type="hidden" name="id" value={noteId} />
      </Field>

      <Field>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="text-lg"
        />
      </Field>

      <Field>
        <Label>Content</Label>
        {isConverting ? (
          <div className="min-h-80 border rounded-xl flex items-center justify-center bg-muted/50">
            Loading editor...
          </div>
        ) : (
          <Tiptap
            id="content"
            name="content"
            placeholder="What's on your mind?"
            initialContent={htmlContent} // ← Pass HTML to Tiptap
            onContentChange={setMarkdownContent} // ← Receives Markdown back
          />
        )}
      </Field>

      <div className="flex justify-between items-center gap-4 pt-6">
        <div className="text-sm text-slate-500">
          {/* can also show created/updated here if you want */}
        </div>

        <div className="flex gap-2 items-center">
          <DeleteNote id={noteId} />
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={!hasChanges}
            onClick={handleUpdate}
          >
            <PenIcon weight="bold" className="size-4" /> Save Changes
          </Button>
        </div>
      </div>
    </FieldGroup>
  );
}
