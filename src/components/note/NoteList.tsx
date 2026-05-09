"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import TagsFilter from "@/components/note/TagsFilter";

import NoteCard from "./NoteCard";

import { frameworks } from "@/lib/constants";

import { NoteType } from "@/types/note";

const NoteList = ({
  list,
  allTags,
}: {
  list: NoteType[];
  allTags: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("Last Updated");

  const [isPending, startTransition] = useTransition();

  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    list,
    (
      state,
      { noteId, newPinnedState }: { noteId: string; newPinnedState: boolean },
    ) => {
      return state.map((note) =>
        note._id === noteId
          ? {
              ...note,
              isPinned: newPinnedState,

              pinnedAt: newPinnedState ? new Date() : null,
            }
          : note,
      );
    },
  );

  const sortedAndFilteredNotes = useMemo(() => {
    const filtered = optimisticNotes.filter(
      (note) =>
        selectedTags.length === 0 ||
        selectedTags.every((tag) => note.tags?.includes(tag)),
    );

    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

      const timeA = a.pinnedAt ? +new Date(a.pinnedAt) : +new Date(a.updatedAt);
      const timeB = b.pinnedAt ? +new Date(b.pinnedAt) : +new Date(b.updatedAt);

      switch (filter) {
        case "A-Z":
          return a.title.localeCompare(b.title);
        case "Z-A":
          return b.title.localeCompare(a.title);
        case "Last Created":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        default:
          return timeB - timeA;
      }
    });
  }, [optimisticNotes, selectedTags, filter]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center items-center justify-center gap-6 scroll-auto p-5">
        <div className="col-start-1 -col-end-1 flex justify-between gap-2 items-center">
          {/* categories filter */}
          <Drawer direction={"bottom"}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer font-heading rounded-lg pb-0.5"
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
              {allTags ? (
                <TagsFilter
                  allTags={allTags}
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                />
              ) : (
                <EmptyPlaceholder
                  type="search"
                  title="NO CATEGORIES"
                  description="You don't have any categories yet, Get started by creating your
          first note to get categories"
                />
              )}
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
          {/* sort by */}
          <Select onValueChange={(item) => setFilter(item)}>
            <SelectTrigger className="max-w-max w-full cursor-pointer rounded-lg">
              <SelectValue placeholder={filter} />
            </SelectTrigger>
            <SelectContent position="item-aligned" className="rounded-lg">
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

        {/* pinned notes */}
        <div className="col-start-1 -col-end-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center items-center justify-center gap-6 scroll-auto mb-10">
          <h2 className="font-heading text-xl font-bold col-start-1 -col-end-1">
            Pinned Notes
          </h2>

          {sortedAndFilteredNotes.length > 0 &&
            sortedAndFilteredNotes
              .filter((n) => n.isPinned)
              .map((n) => (
                <NoteCard
                  key={n._id}
                  noteData={n}
                  isPending={isPending}
                  startTransition={startTransition}
                  addOptimisticNote={addOptimisticNote}
                />
              ))}
        </div>

        <h2 className="font-heading text-xl font-bold col-start-1 -col-end-1">
          Other Notes
        </h2>
        {/* other notes */}
        {sortedAndFilteredNotes.length ? (
          sortedAndFilteredNotes
            .filter((n) => !n.isPinned)
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
            .map((n) => (
              <NoteCard
                key={n._id}
                noteData={n}
                isPending={isPending}
                startTransition={startTransition}
                addOptimisticNote={addOptimisticNote}
              />
            ))
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
