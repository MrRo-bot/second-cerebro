import { Editor } from "@tiptap/react";
import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  CodeIcon,
} from "@phosphor-icons/react";
import { Toggle } from "@/components/ui/toggle";

const TiptapBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-xl mb-2">
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
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon weight="bold" className="size-4" />
      </Toggle>
    </div>
  );
};

export default TiptapBubbleMenu;
