"use client";

// import { useState, useEffect } from "react";
// import { PenIcon } from "@phosphor-icons/react";
// import { marked } from "marked";

// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Field, FieldGroup } from "@/components/ui/field";
// import Tiptap from "@/components/tiptap/Tiptap";

// import { renderToast } from "@/lib/utils";
// import { StatusType } from "@/types/types";

// import { updateNoteAction } from "@/actions/note.action";

const Note = ({
  id,
}: {
  id: string;
}) => {

//   const [htmlContent, setHtmlContent] = useState(""); // For Tiptap
//   const [isConverting, setIsConverting] = useState(false);

//   // Converting Markdown → HTML when the page renders / initialMarkdown changes
//   useEffect(() => {
//     (async () => {
//       if (!initialMarkdown) {
//         setHtmlContent("");
//         return;
//       }

//       setIsConverting(true);

//       try {
//         const html = await marked(initialMarkdown, {
//           breaks: true, // Convert newlines to <br>
//           gfm: true, // GitHub Flavored Markdown (tables, task lists, etc.)
//         });
//         setHtmlContent(html);
//       } catch (error) {
//         renderToast({
//           status: "error",
//           message: "Markdown conversion failed: " + JSON.stringify(error),
//         });
//         setHtmlContent(initialMarkdown); // fallback to raw text
//       } finally {
//         setIsConverting(false);
//       }
//     })();
//   }, [initialMarkdown]);

//   const hasChanges =
//     title !== initialTitle || markdownContent !== initialMarkdown;

//   const handleUpdate = async () => {
//     const updatePayload: { title?: string; content?: string } = {};

//     if (title !== initialTitle) updatePayload.title = title;
//     if (markdownContent !== initialMarkdown)
//       updatePayload.content = markdownContent;

//     const updateAction = await updateNoteAction(id, updatePayload);

//     if (updateAction) {
//       renderToast({
//         status: updateAction.status as StatusType,
//         message: updateAction.message,
//       });
//     }
//   };

  return (
    // <FieldGroup>
    //   <Field>
    //     <Label htmlFor="title">Title</Label>
    //     <Input
    //       id="title"
    //       value={title}
    //       onChange={(e) => setTitle(e.target.value)}
    //     />
    //   </Field>

    //   <Field>
    //     <Label>Content</Label>
    //     {isConverting ? (
    //       <div className="min-h-80 border rounded-xl flex items-center justify-center bg-muted/50">
    //         Loading editor...
    //       </div>
    //     ) : (
    //       <Tiptap
    //         id="content"
    //         name="content"
    //         placeholder="What's on your mind?"
    //         initialContent={htmlContent} // ← Pass HTML to Tiptap
    //         onContentChange={setMarkdownContent} // ← Receives Markdown back
    //       />
    //     )}
    //   </Field>
    //   <Button variant="secondary" className="cursor-pointer">
    //     Cancel
    //   </Button>
    //   <Button
    //     disabled={!hasChanges}
    //     onClick={handleUpdate}
    //     className="cursor-pointer"
    //   >
    //     <PenIcon weight="bold" className="size-4" />
    //     Update
    //   </Button>
    // </FieldGroup>
  );
};

export default Note;
