"use client";

import {
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import {
  TrashIcon,
  WarningDiamondIcon,
  XIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

import NoteCard from "./NoteCard";

import { frameworks } from "@/lib/constants";
// import { capitalizeTag } from "@/lib/utils";

import { deleteMultipleNoteAction } from "@/actions/note.action";

import { NoteType } from "@/types/note";

const NoteList = ({
  list,
  allTags,
}: {
  list: NoteType[];
  allTags: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectionList, setSelectionList] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("Last Updated");
  const [search, setSearch] = useState("");

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

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.key.toLowerCase();

      const modifierMatch = e.metaKey || e.ctrlKey ? true : false;

      if (modifierMatch && pressedKey === "a") {
        e.preventDefault();
        const selectedAll = sortedAndFilteredNotes.reduce(
          (acc: string[], current: NoteType) => {
            if (acc.length > 0) {
              return [...acc, current._id];
            } else {
              return [current._id];
            }
          },
          [],
        );
        setSelectionList(selectedAll);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortedAndFilteredNotes]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-content-center items-center justify-center gap-6 scroll-auto p-5">
        <div className="col-start-1 -col-end-1 flex justify-between gap-2 items-center">
          {/* selection settings popup */}

          {selectionList.length > 0 && (
            <div className="selectionPopup fixed -translate-x-1/2 left-1/2 bottom-5 z-100 mx-auto w-52 py-2 px-3 flex items-center justify-between rounded-lg backdrop-blur-md dark:shadow-[0_2px_2px_rgba(155,155,155,0.2),0_0_4px_rgba(155,155,155,0.1)] shadow-[0_2px_2px_rgba(155,155,155,0.9),0_0_4px_rgba(155,155,155,0.8)]">
              <div className="absolute inset-0 rounded-lg z-96 blur-xs saturate-120 brightness-115"></div>
              <div className="absolute inset-0 rounded-lg z-97 bg-white/5"></div>
              <div className="absolute inset-0 rounded-lg z-98 shadow-[inset_1px_1px_0_rgba(255,255,255,0.15),inset_0_0_5px_rgba(255,255,255,0.25)]"></div>
              <div className="font-heading">
                {selectionList?.length}&nbsp;&nbsp;selected
              </div>
              <div className="flex gap-2 items-center justify-center z-99">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer bg-transparent! p-0! border-0 ring-0 hover:scale-105 focus-visible:scale-105 active:scale-125 transition-transform"
                    >
                      <TrashIcon weight="bold" className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-lg gap-2 text-destructive">
                        <WarningDiamondIcon weight="bold" className="size-4" />
                        Delete Selected Notes
                      </DialogTitle>
                      <DialogDescription>Are you sure?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="cursor-pointer rounded-lg pt-0.5"
                        >
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        className="cursor-pointer rounded-lg"
                        variant="destructive"
                        onClick={async () => (
                          await deleteMultipleNoteAction(selectionList),
                          setSelectionList([])
                        )}
                      >
                        <TrashIcon weight="bold" className="size-5" /> Yes,
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div
                  onClick={() => setSelectionList([])}
                  className="cursor-pointer hover:scale-105 focus-visible:scale-105 active:scale-125 transition-transform"
                >
                  <XIcon weight="bold" className="size-5" />
                </div>
              </div>
            </div>
          )}
          {/* categories filter */}
          <Drawer direction={"left"}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="cursor-pointer rounded-lg">
                Category Filters
              </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-white/4 backdrop-blur-[48px] border border-solid border-white/12 shadow-[rgba(0, 0, 0, 0.02)_0px_3px_2px] z-250">
              <DrawerHeader className="px-3! pt-2! pb-0!">
                <DrawerTitle className="font-heading text-4xl">
                  Categories
                </DrawerTitle>
                <DrawerDescription className="text-base mt-2">
                  Choose Multiple
                </DrawerDescription>
              </DrawerHeader>
              <div className="no-scrollbar overflow-y-auto">
                {allTags ? (
                  <>
                    <div className="flex flex-wrap gap-2 p-2 mx-auto justify-center">
                      {allTags
                        .filter((t) => t.includes(search))
                        .map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <Badge
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              variant="outline"
                              className={`${
                                isSelected
                                  ? "border-theme-red/50! dark:border-theme-yellow/20! dark:text-theme-yellow/80 text-theme-red dark:text-shadow-theme-yellow/40 text-shadow-theme-red/40"
                                  : "border-theme-purple/50! dark:border-theme-cyan/20! dark:text-theme-cyan/80 text-theme-purple dark:text-shadow-theme-cyan/40 text-shadow-theme-purple/40"
                              } text-shadow-[0_0_5px] uppercase cursor-pointer rounded-sm! pt-1`}
                            >
                              {tag}
                            </Badge>
                          );
                        })}
                    </div>
                  </>
                ) : (
                  <EmptyPlaceholder
                    type="search"
                    title="NO CATEGORIES"
                    description="You don't have any categories yet, Get started by creating your
          first note to get categories"
                  />
                )}
              </div>
              <DrawerFooter className="flex-row! py-2!">
                <div className="flex flex-row gap-2 justify-center items-center mx-auto p-1.5 rounded-lg border">
                  <div className="border-x-3 border-theme-teal shadow-[10px_10px_20px_rgba(0,0,0,.24)] rounded-lg p-0.5">
                    <InputGroup className="w-max rounded-lg bg-transparent!">
                      <InputGroupInput
                        name="search"
                        placeholder="eg. travel"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <InputGroupAddon>
                        <MagnifyingGlassIcon weight="bold" className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>

                  {/* {selectedTags.length > 0 && (
                  <p className="mt-3 text-sm text-slate-500">
                    Showing notes with:{" "}
                    {selectedTags.map((t) => `${capitalizeTag(t)}`).join(", ")}
                  </p>
                )} */}
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer w-max pt-1 rounded-lg bg-theme-teal! text-black/90 dark:text-black hover:text-black/50 hover:dark:text-black/70 font-bold uppercase shadow-[0_0_10px]! shadow-theme-teal/50! hover:shadow-theme-teal!"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
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

        {sortedAndFilteredNotes.filter((n) => n.isPinned).length ? (
          <>
            <div className="col-start-1 -col-end-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-content-center items-center justify-center gap-6 scroll-auto mb-10">
              <h2 className="text-primary font-heading text-xl font-black col-start-1 -col-end-1 tracking-widest">
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
                      selectionList={selectionList}
                      setSelectionList={setSelectionList}
                    />
                  ))}
            </div>
            <h2 className="font-heading text-xl text-primary font-black col-start-1 -col-end-1 tracking-widest">
              Other Notes
            </h2>
          </>
        ) : (
          ""
        )}

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
                selectionList={selectionList}
                setSelectionList={setSelectionList}
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
