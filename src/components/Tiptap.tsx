"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import TurndownService from "turndown";

import TiptapFixedMenu from "@/components/TiptapFixedMenu";
import TiptapBubbleMenu from "@/components/TiptapBubbleMenu";
import TiptapFloatMenu from "@/components/TiptapFloatMenu";

import { TiptapPropsType } from "@/types/types";

const lowlight = createLowlight(common);
const turndown = new TurndownService();

const Tiptap = ({ id, name, placeholder }: TiptapPropsType) => {
  const [content, setContent] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, link: false }),
      Placeholder.configure({ placeholder, showOnlyWhenEditable: true }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndown.turndown(html);
      setContent(markdown);
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert focus:outline-none h-125 p-4 w-100",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="relative w-full border rounded-xl bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-all">
      <div className="relative">
        <>
          <BubbleMenu editor={editor}>
            <TiptapBubbleMenu editor={editor} />
          </BubbleMenu>

          <FloatingMenu editor={editor}>
            <TiptapFloatMenu editor={editor} />
          </FloatingMenu>

          <TiptapFixedMenu editor={editor} />
        </>

        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} id={id} value={content} />
    </div>
  );
};

export default Tiptap;
