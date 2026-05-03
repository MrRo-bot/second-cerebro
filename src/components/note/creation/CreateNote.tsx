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
          className="flex gap-3 justify-between font-medium items-center w-max cursor-pointer rounded-full transition-colors duration-200 ease-in-out bg-[#ff4b13] hover:bg-[#fc4f66] py-2 px-4"
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
      <DialogContent className="sm:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold sr-only hidden">
            Add Note
          </DialogTitle>
          <DialogDescription className="sr-only hidden">
            Whats on your mind?
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="rounded-xl">
            <TabsTrigger className="cursor-pointer rounded-xl" value="empty">
              Empty note
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer rounded-xl" value="url">
              URL
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer rounded-xl" value="pdf">
              PDF
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer rounded-xl" value="docx">
              Docx
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-xl"
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
