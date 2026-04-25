"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { format, formatRelative } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import TagsFilter from "@/components/note/TagsFilter";

import { capitalizeTag } from "@/lib/utils";
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

  const filteredNotes = useMemo(() => {
    return list.filter((note) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => note.tags?.includes(tag));

      return matchesTags;
    });
  }, [list, selectedTags]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-content-center items-center justify-center gap-6 scroll-auto p-5">
        <div className="col-start-1 -col-end-1 flex justify-between gap-2 items-center">
          {/* TODO: maybe drawer for category filter left or bottom side  */}

          <Drawer direction={"bottom"}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="cursor-pointer font-heading">
                Category Filters
              </Button>
            </DrawerTrigger>
            {/* className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]" */}
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="font-heading text-2xl">
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
                    className="cursor-pointer w-max mx-auto text-base"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Select onValueChange={(item) => setFilter(item)}>
            <SelectTrigger className="max-w-max w-full cursor-pointer">
              <SelectValue placeholder={filter} />
            </SelectTrigger>
            <SelectContent position="popper" alignOffset={25}>
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
            .map((n) => (
              <Card
                key={n._id}
                className="relative h-full flex-col flex justify-between"
              >
                <Link
                  className="absolute inset-0 inline-block z-5"
                  href={`dashboard/${n._id}`}
                />
                <CardHeader>
                  <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-5/6">
                    {n.title}
                  </h3>
                </CardHeader>
                <CardContent className="w-5/6 line-clamp-4 text-ellipsis mb-auto">
                  {/* rendering markdown */}
                  <MarkdownRenderer content={n.content} />
                </CardContent>

                <CardFooter className="py-1 px-4 text-slate-600 flex flex-col items-start justify-center">
                  <p>
                    created: {format(n.createdAt, "do 'of' MMMM 'at' HH:MM aa")}
                  </p>
                  <p>updated: {formatRelative(n.updatedAt, new Date())}</p>

                  <div className="flex gap-1 flex-wrap">
                    {n.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full pt-1"
                      >
                        {capitalizeTag(tag)}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
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
