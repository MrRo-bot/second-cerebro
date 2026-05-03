"use client";

import { useState, KeyboardEvent } from "react";
import { XIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { capitalizeTag } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { TagsManagerProps } from "@/types/note";

export const TagsInput = ({
  tags,
  onChange,
  placeholder = "Add a tag...",
}: TagsManagerProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();

    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-base">Tags</Label>

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge
            className="flex items-center gap-1 bg-primary/10 text-primary p-1 pl-2 rounded-full text-sm h-auto!"
            key={index}
          >
            {capitalizeTag(tag)}
            <Button
              type="button"
              onClick={() => removeTag(tag)}
              className="cursor-pointer rounded-full aspect-square! transition-colors size-6! hover:bg-white/50"
            >
              <XIcon weight="bold" className="size-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onBlur={() => addTag(inputValue)}
        disabled={tags.length >= 5}
      />
    </div>
  );
};
export default TagsInput;
