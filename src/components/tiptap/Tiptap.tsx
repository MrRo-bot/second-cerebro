"use client";

import { useImperativeHandle, useState, useEffect } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { UndoRedo } from "@tiptap/extensions";
// import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import TurndownService from "turndown";

import TiptapFixedMenu from "@/components/tiptap/TiptapFixedMenu";
// import TiptapBubbleMenu from "@/components/tiptap/TiptapBubbleMenu";
// import TiptapFloatMenu from "@/components/tiptap/TiptapFloatMenu";

import { TiptapPropsType } from "@/types/types";

// all language support
const lowlight = createLowlight(all);
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

  //TODO: configurable option
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false, link: false, undoRedo: false }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder, showOnlyWhenEditable: true }),
      CodeBlockLowlight.configure({
        lowlight,
        enableTabIndentation: true,
        defaultLanguage: "js",
      }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      UndoRedo,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
    ],
    content: initialContent, // initial render
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Only convert if there is content to save performance
      const markdown = html === "<p></p>" ? "" : turndown.turndown(html);
      setContent(markdown);
      onContentChange?.(markdown); // notifying parent
    },

    editorProps: {
      attributes: {
        class:
          "tiptap prose max-w-full dark:prose-invert focus:outline-none min-h-75 p-1",
      },
    },
  });

  // undo redo now works
  const undoredoState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        canUndo: ctx?.editor?.can().chain().focus().undo().run(),
        canRedo: ctx?.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  // Exposing the API to the parent
  useImperativeHandle(
    ref,
    () => ({
      clearContent: () => {
        editor?.commands.setContent("");
      },
      getMarkdown: () => {
        return content; // Helpful if i need the value outside of FormData
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor],
  );

  // updating editor when initialContent changes (e.g. reopening dialog)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return (
    <div
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "b") {
          e.stopPropagation();
        }
      }}
      className="relative rounded-xl border bg-background shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring transition-all"
    >
      <div className="relative">
        <EditorContent editor={editor} className="overflow-y-auto" />
        {editor && (
          <>
            {/* <BubbleMenu editor={editor}>
              <TiptapBubbleMenu editor={editor} />
            </BubbleMenu>

            <FloatingMenu editor={editor}>
              <TiptapFloatMenu editor={editor} />
            </FloatingMenu> */}

            <TiptapFixedMenu editor={editor} undoRedo={undoredoState} />
          </>
        )}
      </div>

      {/* hidden input for form submission if needed */}
      <input type="hidden" name={name} id={id} value={content || ""} />
    </div>
  );
};

export default Tiptap;
