"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { capitalizeTag, cn } from "@/lib/utils";

interface TagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const Tags = ({
  tags,
  onTagsChange,
  placeholder = "Add a tag...",
  className,
}: TagsManagerProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();

    if (!trimmedTag) return;
    if (tags.length >= 5) {
      setError(`Maximum ${5} tags allowed`);
      return;
    }
    if (tags.some((t) => t.toLowerCase() === trimmedTag)) {
      setError("Tag already exists");
      return;
    }

    onTagsChange([...tags, trimmedTag]);
    setInputValue("");
    setError("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Tags Display */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 text-sm"
          >
            {capitalizeTag(tag)}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-muted p-0.5 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <XIcon weight="bold" className="size-3" />
            </button>
          </Badge>
        ))}

        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags added yet.</p>
        )}
      </div>

      {/* Add Tag Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={tags.length >= 5}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim() || tags.length >= 5}
          size="icon"
        >
          <PlusIcon weight="bold" className="size-4" />
        </Button>
      </div>

      {/* Helper Text & Error */}
      <div className="flex items-center justify-between text-xs">
        <p className="text-muted-foreground">
          {tags.length}/{5} tags • Press Enter to add
        </p>
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  );
};
export default Tags;
