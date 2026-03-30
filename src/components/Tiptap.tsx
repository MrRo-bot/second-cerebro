"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import TurndownService from "turndown";

import TiptapFixedMenu from "@/components/TiptapFixedMenu";
import TiptapBubbleMenu from "@/components/TiptapBubbleMenu";
import TiptapFloatMenu from "@/components/TiptapFloatMenu";

const lowlight = createLowlight(common);
const turndown = new TurndownService();

const Tiptap = () => {
  const [content, setContent] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      //* starter kit with code block, link, tasklist, image, support
      StarterKit.configure({ codeBlock: false, link: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image,
    ],
    content: "<p>What you got...</p>",
    onUpdate: ({ editor }) => {
      //* converts html to markdown string for database
      const html = editor.getHTML();
      const markdown = turndown.turndown(html);
      setContent(markdown);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-2 overflow-auto",
      },
    },
  });

  if (!editor) return null;

  // TODO: CHECK FOR MORE TIPTAP CONTROLS LIKE NOTES EXTENSIONS AND ALL IN THEIR OFFICIAL DOCS
  return (
    <div className="relative w-full border rounded-xl bg-background shadow-sm overflow-hidden">
      <div className="relative p-5">
        {/* 2. Selection Menu */}
        <BubbleMenu editor={editor}>
          <TiptapBubbleMenu editor={editor} />
        </BubbleMenu>

        {/* 3. New Line Menu */}
        <FloatingMenu editor={editor}>
          <TiptapFloatMenu editor={editor} />
        </FloatingMenu>

        {/* Actual Editor Surface */}
        <EditorContent editor={editor} />

        {/* 1. Persistent Top Menu */}
        <TiptapFixedMenu editor={editor} />
      </div>
      {/* Hidden input for Server Action */}
      <input type="hidden" name="content" id="content" value={content} />
    </div>
  );
};

export default Tiptap;
