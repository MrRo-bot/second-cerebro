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
  TextUnderlineIcon,
  TextHOneIcon,
  TextStrikethroughIcon,
  HighlighterIcon,
  LinkIcon,
  AlignLeftIcon,
  AlignCenterHorizontalIcon,
  AlignRightIcon,
} from "@phosphor-icons/react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

const TiptapFixedMenu = ({
  editor,
  undoRedo,
}: {
  editor: Editor;
  undoRedo: {
    canUndo: boolean | undefined;
    canRedo: boolean | undefined;
  } | null;
}) => {
  return (
    <div className="flex items-center gap-1 p-1 border-t bg-muted/10">
      <div className="flex">
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
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <TextUnderlineIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <TextStrikethroughIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <TextHOneIcon weight="bold" className="size-4" />
        </Toggle>
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
          pressed={editor.isActive("highlight")}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <HighlighterIcon weight="bold" className="size-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive("left")}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <AlignLeftIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("center")}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenterHorizontalIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("right")}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRightIcon weight="bold" className="size-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex">
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

      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive("block")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <CodeBlockIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("link")}
          onPressedChange={() => editor.chain().focus().toggleLink().run()}
        >
          <LinkIcon weight="bold" className="size-4" />
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

      <div className="ml-auto flex">
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!undoRedo?.canUndo}
        >
          <ArrowUUpLeftIcon weight="bold" className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!undoRedo?.canRedo}
        >
          <ArrowUUpRightIcon weight="bold" className="size-4" />
        </Toggle>
      </div>
    </div>
  );
};

export default TiptapFixedMenu;
