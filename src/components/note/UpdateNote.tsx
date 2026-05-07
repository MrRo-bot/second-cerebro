"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { PenIcon } from "@phosphor-icons/react";
import { marked } from "marked";
import { formatRelative } from "date-fns";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import DeleteNote from "@/components/note/DeleteNote";
import TagsInput from "@/components/note/TagsInput";
import Tiptap from "@/components/tiptap/Tiptap";

import { renderToast } from "@/lib/utils";

import { updateNoteAction } from "@/actions/note.action";

type Props = {
  noteId: string;
  noteTitle: string;
  noteContent: string;
  noteTags?: string[];
  noteUpdatedAt?: string;
};

const UpdateNote = ({
  noteId,
  noteTitle,
  noteContent,
  noteTags,
  noteUpdatedAt,
}: Props) => {
  const [title, setTitle] = useState(noteTitle);
  const [markdownContent, setMarkdownContent] = useState(noteContent);
  const [htmlContent, setHtmlContent] = useState(""); //* For Tiptap
  const [isConverting, setIsConverting] = useState(false);
  const [manualTags, setManualTags] = useState(noteTags || []);

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
          breaks: true, // Convert newlines to <br>
          gfm: true, // GitHub Flavored Markdown (tables, task lists, etc.)
        });
        setHtmlContent(html);
      } catch (error) {
        renderToast({
          status: "error",
          message: "Markdown conversion failed: " + JSON.stringify(error),
        });
        setHtmlContent(noteContent); // fallback to raw text
      } finally {
        setIsConverting(false);
      }
    })();
  }, [noteContent]);

  const hasChanges =
    title !== noteTitle ||
    markdownContent !== noteContent ||
    JSON.stringify(manualTags?.sort()) !== JSON.stringify(noteTags?.sort()); //deep comparison of array

  const handleUpdate = async () => {
    const updatePayload: {
      title?: string;
      content?: string;
      manualTags?: string[];
    } = {};

    if (title !== noteTitle) updatePayload.title = title;
    if (markdownContent !== noteContent)
      updatePayload.content = markdownContent;
    if (JSON.stringify(manualTags?.sort()) !== JSON.stringify(noteTags?.sort()))
      updatePayload.manualTags = manualTags;

    const state = await updateNoteAction(noteId, updatePayload);

    if (state) {
      renderToast({
        status: state.status,
        message: state.message,
      });
      redirect("/dashboard");
    }
  };

  //title fade in animation
  useGSAP(() => {
    gsap.to(".title", {
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.4,
    });
  });

  //content fade in animation
  useGSAP(() => {
    gsap.to(".content", {
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.6,
    });
  });

  //edited datestamp slide in left animation
  useGSAP(() => {
    gsap.to(".editedAt", {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.8,
    });
  });

  //button slide in right animation
  useGSAP(() => {
    gsap.to(".button", {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 1,
    });
  });

  return (
    <FieldGroup>
      <Field>
        <input type="hidden" name="id" value={noteId} />
        <TagsInput
          tags={manualTags}
          onChange={setManualTags}
          placeholder="Add a tag and press Enter or comma"
        />
      </Field>

      <Field className="title opacity-0">
        <Label htmlFor="title" className="text-lg">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add note title"
          required
          className="text-base! rounded-lg"
        />
      </Field>

      <Field className="content opacity-0">
        <Label className="text-lg">Content</Label>
        {isConverting ? (
          <div className="min-h-80 border rounded-lg flex items-center justify-center bg-muted/50">
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
        <div className="editedAt opacity-0 -translate-x-10 text-sm text-slate-500">
          {noteUpdatedAt && (
            <p>Edited: {formatRelative(noteUpdatedAt, new Date())}</p>
          )}
        </div>

        <div className="button opacity-0 translate-x-10 flex gap-2 items-center">
          <DeleteNote id={noteId} />
          <Button
            className="cursor-pointer rounded-lg pt-0.5"
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
};
export default UpdateNote;
