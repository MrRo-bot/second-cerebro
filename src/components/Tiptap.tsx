"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react";

import { Toggle } from "@/components/ui/toggle";

//TODO: IMPLEMENTING IT MAKE IT BETTER AND COMPATIBLE WITH UI AND MONGODB
export default function TiptapEditor({
  onChange,
  content,
}: {
  onChange: (html: string) => void;
  content: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    //* for server components: to avoid hydration errors
    immediatelyRender: false,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Tailor styles to match shadcn's input feel
    editorProps: {
      attributes: {
        class:
          "rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[150px] prose dark:prose-invert",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1 border rounded-md p-1 bg-muted/50">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <TextBolderIcon weight="bold" className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalicIcon weight="bold" className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <TextUnderlineIcon weight="bold" className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

// TODO: another method of using starterKit maybe can combine both above and below method
//! "use client";

//! import { useEditor, EditorContent } from "@tiptap/react";
//! import StarterKit from "@tiptap/starter-kit";

//! const Tiptap = () => {
//!   const editor = useEditor({
//!     extensions: [StarterKit],
//!     content: "<p>Hello World! 🌎️</p>",
//!     // to avoid SSR issues
//!     immediatelyRender: false,
//!   });

//!   return <EditorContent editor={editor} />;
//! };

//! export default Tiptap;
