"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, formatRelative } from "date-fns";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import { Badge } from "@/components/ui/badge";
import TagsFilter from "@/components/note/TagsFilter";

import { capitalizeTag } from "@/lib/utils";

import { NoteType } from "@/types/note";

const NoteList = ({
  list,
  allTags,
}: {
  list: NoteType[];
  allTags: string[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      <TagsFilter
        allTags={allTags}
        selectedTags={selectedTags}
        onChange={setSelectedTags}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-content-center items-center justify-center gap-6 py-10">
        {filteredNotes.length ? (
          filteredNotes
            .sort(
              (a, b) => +format(b.updatedAt, "T") - +format(a.updatedAt, "T"),
            )
            .map((n) => (
              <Card
                key={n._id}
                className="h-full flex-col flex justify-between"
              >
                <CardHeader className="relative flex justify-between items-center">
                  <Link
                    className="absolute inset-0 inline-block"
                    href={`dashboard/${n._id}`}
                  />
                  <h3 className="uppercase font-heading font-bold tracking-widest line-clamp-2 text-ellipsis w-5/6">
                    {n.title}
                  </h3>
                </CardHeader>
                <CardContent className="relative w-5/6 line-clamp-4 text-ellipsis mb-auto">
                  <Link
                    className="absolute inset-0 inline-block"
                    href={`dashboard/${n._id}`}
                  />
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
