import { Editor } from "@tiptap/react";
import {
  TextBIcon,
  TextItalicIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  CodeBlockIcon,
  QuotesIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  CheckSquareIcon,
  TextHTwoIcon,
} from "@phosphor-icons/react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

const TiptapFixedMenu = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/10">
      <div className="flex gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <TextBIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextItalicIcon weight="bold" className="size-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <TextHTwoIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <ListBulletsIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListNumbersIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("taskList")}
          onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
        >
          <CheckSquareIcon weight="bold" className="size-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlockIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <QuotesIcon weight="bold" className="size-4" />
        </Toggle>
      </div>

      <div className="ml-auto flex gap-1">
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <ArrowUUpLeftIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <ArrowUUpRightIcon weight="bold" className="size-4" />
        </Toggle>
      </div>
    </div>
  );
};

export default TiptapFixedMenu;
