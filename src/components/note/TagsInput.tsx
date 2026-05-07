"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { XIcon } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { capitalizeTag } from "@/lib/utils";

import { TagsManagerProps } from "@/types/note";

export const TagsInput = ({
  tags,
  onChange,
  placeholder = "Add a tag...",
}: TagsManagerProps) => {
  const tagsRef = useRef(null);
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

  //tags stagger animation
  useGSAP(
    () => {
      gsap.to(".tag", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        stagger: 0.1,
        //         stagger: {
        //   each: 0.1,
        //   grid: "auto", // Automatically detects column count
        //   from: "start"  // Can be "start", "center", "end", or "edges"
        // }
      });
    },
    { scope: tagsRef },
  );

  return (
    <div className="space-y-3">
      <Label className="text-lg">
        Tags <strong>(upto 5)</strong>
      </Label>

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onBlur={() => addTag(inputValue)}
        disabled={tags.length >= 5}
      />

      <div ref={tagsRef} className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge
            className="tag flex -translate-y-30 opacity-0 items-center gap-1 bg-primary/10 text-primary p-1 pl-2 rounded-full text-sm h-auto!"
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
    </div>
  );
};
export default TagsInput;
