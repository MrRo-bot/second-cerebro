"use client";

import { PlusSquareIcon } from "@phosphor-icons/react";

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

const CreateNote = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 justify-between w-max cursor-pointer items-center bg-sidebar dark:bg-sidebar-primary py-1 pl-1.75 pr-2">
          <PlusSquareIcon weight="duotone" className="size-6" />
          Add Note
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
