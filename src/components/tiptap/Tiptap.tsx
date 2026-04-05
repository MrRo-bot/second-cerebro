"use client";

import { useImperativeHandle, useState, useEffect } from "react";
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

import TiptapFixedMenu from "@/components/tiptap/TiptapFixedMenu";
import TiptapBubbleMenu from "@/components/tiptap/TiptapBubbleMenu";
import TiptapFloatMenu from "@/components/tiptap/TiptapFloatMenu";

import { TiptapPropsType } from "@/types/types";

const lowlight = createLowlight(common);
const turndown = new TurndownService();

const Tiptap = ({
  ref,
  id,
  name,
  placeholder,
  initialContent,
  onContentChange,
}: TiptapPropsType) => {
  const [content, setContent] = useState(initialContent);

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
    content: initialContent, //* initial render
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      //* Only convert if there is content to save performance
      const markdown = html === "<p></p>" ? "" : turndown.turndown(html);
      setContent(markdown);
      onContentChange?.(markdown); //* notifying parent
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert focus:outline-none min-h-75 p-2 w-full mx-auto",
      },
    },
  });

  //* Exposing the API to the parent
  useImperativeHandle(
    ref,
    () => ({
      clearContent: () => {
        editor?.commands.setContent("");
      },
      getMarkdown: () => {
        return content; //* Helpful if i need the value outside of FormData
      },
    }),
    [editor],
  );

  //* updating editor when initialContent changes (e.g. reopening dialog)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return (
    <div className="relative rounded-none w-full border bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-all">
      <div className="relative">
        {editor && (
          <>
            <BubbleMenu editor={editor}>
              <TiptapBubbleMenu editor={editor} />
            </BubbleMenu>

            <FloatingMenu editor={editor}>
              <TiptapFloatMenu editor={editor} />
            </FloatingMenu>

            <TiptapFixedMenu editor={editor} />
          </>
        )}

        <EditorContent editor={editor} className="overflow-y-auto w-full" />
      </div>

      {/* hidden input for form submission if needed */}
      <input type="hidden" name={name} id={id} value={content || ""} />
    </div>
  );
};

export default Tiptap;
