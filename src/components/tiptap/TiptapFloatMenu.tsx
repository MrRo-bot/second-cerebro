import { Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import {
  ImageSquareIcon,
  ListBulletsIcon,
  TextHOneIcon,
} from "@phosphor-icons/react";

const TiptapFloatMenu = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/90 backdrop-blur border rounded-full shadow-sm -ml-full">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <TextHOneIcon weight="bold" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletsIcon weight="bold" className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => {
          /* Logic to open image picker */
        }}
      >
        <ImageSquareIcon weight="bold" className="size-4" />
      </Button>
    </div>
  );
};

export default TiptapFloatMenu;
