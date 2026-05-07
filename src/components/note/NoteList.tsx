"use client";

import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import NoteCard from "./NoteCard";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import TagsFilter from "@/components/note/TagsFilter";

import { frameworks } from "@/lib/constants";

import { NoteType } from "@/types/note";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const NoteList = ({
  list,
  allTags,
}: {
  list: NoteType[];
  allTags: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("Last Updated");
  const NoteListRef = useRef<HTMLDivElement | null>(null);

  const filteredNotes = useMemo(() => {
    return list.filter((note) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => note.tags?.includes(tag));

      return matchesTags;
    });
  }, [list, selectedTags]);

  useGSAP(
    () => {
      gsap.to(".note-card", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        //         stagger: {
        //   each: 0.1,
        //   grid: "auto", // Automatically detects column count
        //   from: "start"  // Can be "start", "center", "end", or "edges"
        // }
      });
    },
    { scope: NoteListRef },
  );

  return (
    <>
      <div
        ref={NoteListRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center items-center justify-center gap-6 scroll-auto p-5"
      >
        <div className="col-start-1 -col-end-1 flex justify-between gap-2 items-center">
          <Drawer direction={"bottom"}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer font-heading rounded-md pb-0.5"
              >
                Category Filters
              </Button>
            </DrawerTrigger>
            {/* className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]" */}
            <DrawerContent className="bg-white/4 backdrop-blur-[48px] rounded-lg border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px]">
              <DrawerHeader>
                <DrawerTitle className="font-heading text-4xl">
                  Categories
                </DrawerTitle>
                <DrawerDescription className="text-base my-2">
                  Choose Multiple
                </DrawerDescription>
              </DrawerHeader>
              {/* <div className="no-scrollbar overflow-y-auto px-4"> */}
              <TagsFilter
                allTags={allTags}
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer w-max mx-auto text-base rounded-lg"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Select onValueChange={(item) => setFilter(item)}>
            <SelectTrigger className="max-w-max w-full cursor-pointer rounded-md">
              <SelectValue placeholder={filter} />
            </SelectTrigger>
            <SelectContent position="item-aligned" className="rounded-md">
              <SelectGroup>
                {frameworks.map((item: string) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={item}
                    value={item}
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {filteredNotes.length ? (
          filteredNotes
            .sort((a, b) => {
              switch (filter) {
                case "Last Created":
                  return +format(b.createdAt, "T") - +format(a.createdAt, "T");
                case "A-Z":
                  return a.title.localeCompare(b.title);
                case "Z-A":
                  return b.title.localeCompare(a.title);
                default:
                  return +format(b.updatedAt, "T") - +format(a.updatedAt, "T");
              }
            })
            .map((n) => <NoteCard key={n._id} noteData={n} />)
        ) : (
          <div className="col-start-1 -col-end-1">
            <EmptyPlaceholder
              type="note"
              title="NO NOTES YET"
              description="You haven't created any notes yet, Get started by creating your
          first note"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NoteList;
