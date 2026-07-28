"use client";

import { useRef } from "react";
import { PlusIcon } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AddEmpty from "@/components/note/creation/AddEmpty";
import AddUrl from "@/components/note/creation/AddUrl";
import AddPdf from "@/components/note/creation/AddPdf";
import AddDocx from "@/components/note/creation/AddDocx";
import AddTranscript from "@/components/note/creation/AddTranscript";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import useKeyshortcut from "@/hooks/use-keyshortcut";

const CreateNote = () => {
  const createButtonRef = useRef<HTMLDivElement>(null);

  useKeyshortcut(createButtonRef, { key: "f", ctrlOrMeta: true, shift: true });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={createButtonRef}
          tabIndex={1}
          className="flex gap-3 justify-between font-medium items-center w-max cursor-pointer rounded-lg transition-colors duration-200 ease-in-out bg-theme-red hover:bg-theme-purple/70 py-2 px-4 shadow-sm shadow-theme-red hover:shadow-theme-purple/70 text-white"
        >
          <PlusIcon weight="bold" className="size-3.5" />
          Add
          <KbdGroup className="rounded-full bg-white/30 gap-0!">
            <Kbd className="bg-transparent text-white font-semibold p-0">⌘</Kbd>
            <Kbd className="bg-transparent text-white font-semibold p-0">
              Shift
            </Kbd>
            <Kbd className="bg-transparent text-white font-semibold p-0">F</Kbd>
          </KbdGroup>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-auto gap-0!">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold sr-only hidden">
            Add Note
          </DialogTitle>
          <DialogDescription className="sr-only hidden">
            Whats on your mind?
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="rounded-full">
            <TabsTrigger
              className="cursor-pointer rounded-full uppercase px-2 w-max h-max pt-1 data-active:bg-theme-teal! data-active:text-black/70 data-active:dark:text-black data-active:shadow-[0_0_10px] data-active:shadow-theme-teal/50 data-active:hover:shadow-theme-teal data-active:hover:text-black/50 data-active:hover:dark:text-black/70"
              value="empty"
            >
              Empty note
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-full uppercase px-2 w-max h-max pt-1 data-active:bg-theme-teal! data-active:text-black/70 data-active:dark:text-black data-active:shadow-[0_0_10px] data-active:shadow-theme-teal/50 data-active:hover:shadow-theme-teal data-active:hover:text-black/50 data-active:hover:dark:text-black/70"
              value="url"
            >
              URL
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-full uppercase px-2 w-max h-max pt-1 data-active:bg-theme-teal! data-active:text-black/70 data-active:dark:text-black data-active:shadow-[0_0_10px] data-active:shadow-theme-teal/50 data-active:hover:shadow-theme-teal data-active:hover:text-black/50 data-active:hover:dark:text-black/70"
              value="pdf"
            >
              PDF
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-full uppercase px-2 w-max h-max pt-1 data-active:bg-theme-teal! data-active:text-black/70 data-active:dark:text-black data-active:shadow-[0_0_10px] data-active:shadow-theme-teal/50 data-active:hover:shadow-theme-teal data-active:hover:text-black/50 data-active:hover:dark:text-black/70"
              value="docx"
            >
              Docx
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-full uppercase px-2 w-max h-max pt-1 data-active:bg-theme-teal! data-active:text-black/70 data-active:dark:text-black data-active:shadow-[0_0_10px] data-active:shadow-theme-teal/50 data-active:hover:shadow-theme-teal data-active:hover:text-black/50 data-active:hover:dark:text-black/70"
              value="transcript"
            >
              Transcript
            </TabsTrigger>
          </TabsList>
          <TabsContent value="empty">
            <AddEmpty />
          </TabsContent>
          <TabsContent value="url">
            <AddUrl />
          </TabsContent>
          <TabsContent value="pdf">
            <AddPdf />
          </TabsContent>
          <TabsContent value="docx">
            <AddDocx />
          </TabsContent>
          <TabsContent value="transcript">
            <AddTranscript />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNote;
