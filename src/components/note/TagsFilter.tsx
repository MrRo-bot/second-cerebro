"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Badge } from "@/components/ui/badge";

import { capitalizeTag } from "@/lib/utils";

import { TagFilterProps } from "@/types/note";

const TagsFilter = ({ allTags, selectedTags, onChange }: TagFilterProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex flex-wrap gap-2 max-w-10/12 mx-auto justify-center">
        {allTags
          .filter((t) => t.includes(search))
          .map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                onClick={() => toggleTag(tag)}
                variant="destructive"
                className={`max-w-max cursor-pointer rounded-full text-base transition-all ${
                  isSelected
                    ? "bg-primary/50 text-white shadow"
                    : "bg-muted hover:bg-muted/80 border"
                }`}
              >
                {capitalizeTag(tag)}
              </Badge>
            );
          })}
      </div>

      <InputGroup className="mx-auto w-max mt-4 mb-2 rounded-lg">
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

      {/* {selectedTags.length > 0 && (
        <p className="mt-3 text-sm text-slate-500">
          Showing notes with:{" "}
          {selectedTags.map((t) => `${capitalizeTag(t)}`).join(", ")}
        </p>
      )} */}
    </>
  );
};
export default TagsFilter;
