"use client";

import { capitalizeTag } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

import { TagFilterProps } from "@/types/note";

const TagsFilter = ({ allTags, selectedTags, onChange }: TagFilterProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Badge
              key={tag}
              onClick={() => toggleTag(tag)}
              variant="destructive"
              className={`max-w-max cursor-pointer rounded-full text-sm transition-all ${
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
