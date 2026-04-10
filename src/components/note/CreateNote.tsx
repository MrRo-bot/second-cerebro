"use client";

import { PlusIcon, PlusSquareIcon } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import AddEmpty from "@/components/note/AddEmpty";
import AddUrl from "@/components/note/AddUrl";
import AddPdf from "@/components/note/AddPdf";
import AddDocx from "@/components/note/AddDocx";
import AddTranscript from "@/components/note/AddTranscript";

const CreateNote = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 justify-between w-max cursor-pointer items-center bg-sidebar dark:bg-sidebar-primary p-1">
          Add Note
          <PlusSquareIcon weight="duotone" className="size-6" />
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
