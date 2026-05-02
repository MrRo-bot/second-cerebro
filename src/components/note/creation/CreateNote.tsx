"use client";

import { useEffect, useRef } from "react";
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
import { Kbd } from "@/components/ui/kbd";

const CreateNote = () => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "f"
      ) {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={buttonRef}
          tabIndex={1}
          className="flex gap-3 justify-between font-medium items-center w-max cursor-pointer rounded-full transition-colors duration-200 ease-in-out bg-[#ff4b13] hover:bg-[#fc4f66] py-2 px-4"
        >
          <PlusIcon weight="bold" className="size-3.5" />
          Add
          <Kbd className="bg-white/30 rounded-full text-white text-sm font-semibold h-auto! pb-0.5! px-1.5!">
            ⌘ shift F
          </Kbd>
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
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="empty">
              Empty note
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="url">
              URL
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="pdf">
              PDF
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="docx">
              Docx
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="transcript">
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
