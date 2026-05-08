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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

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
        {/* bold button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <TextBIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Bold</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">B</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* italic button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <TextItalicIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Italic</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">I</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* underline button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
            >
              <TextUnderlineIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Underline</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">U</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* strikethrough button */}

        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <TextStrikethroughIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">
              StrikeThrough
            </p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">S</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* heading level one button */}

        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <TextHOneIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Heading L1</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Alt</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">1</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* heading level two button */}

        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <TextHTwoIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Heading L2</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Alt</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">2</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* highlighter button */}

        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("highlight")}
              onPressedChange={() =>
                editor.chain().focus().toggleHighlight().run()
              }
            >
              <HighlighterIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Highlight</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">H</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex">
        {/* align left button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("left")}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
            >
              <AlignLeftIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Left Align</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">L</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* align center button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("center")}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenterHorizontalIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">
              Center Align
            </p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">E</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* align right button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("right")}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
            >
              <AlignRightIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Right Align</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">R</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />
      <div className="flex">
        {/* bullet list button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
            >
              <ListBulletsIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Bullet List</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">8</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* ordered list button */}

        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
            >
              <ListNumbersIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">
              Ordered List
            </p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">7</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>

        {/* check list button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("taskList")}
              onPressedChange={() =>
                editor.chain().focus().toggleTaskList().run()
              }
            >
              <CheckSquareIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Checkbox</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">9</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex">
        {/* code block button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("block")}
              onPressedChange={() =>
                editor.chain().focus().toggleCodeBlock().run()
              }
            >
              <CodeBlockIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Code Block</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Alt</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">C</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* link button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("link")}
              onPressedChange={() => editor.chain().focus().toggleLink().run()}
            >
              <LinkIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Link</p>
          </TooltipContent>
        </Tooltip>
        {/* blockquote button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("blockquote")}
              onPressedChange={() =>
                editor.chain().focus().toggleBlockquote().run()
              }
            >
              <QuotesIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">BlockQuote</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">B</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="ml-auto flex">
        {/* undo button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!undoRedo?.canUndo}
            >
              <ArrowUUpLeftIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Undo</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Z</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        {/* redo button */}
        <Tooltip>
          <TooltipTrigger className="cursor-pointer" asChild>
            <Toggle
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!undoRedo?.canRedo}
            >
              <ArrowUUpRightIcon weight="bold" className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent className=" flex items-center flex-col justify-center rounded-lg">
            <p className="font-bold font-heading tracking-wider">Redo</p>
            <KbdGroup>
              <Kbd className="rounded-lg!">Ctrl</Kbd>/
              <Kbd className="rounded-lg!">⌘</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Shift</Kbd>
              <span className="rounded-lg!">+</span>
              <Kbd className="rounded-lg!">Z</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default TiptapFixedMenu;
