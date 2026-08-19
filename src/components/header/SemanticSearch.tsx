"use client";

import Form from "next/form";
import Link from "next/link";
import {
  RefObject,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import {
  ArrowElbowDownLeftIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import FormErrorAlert from "@/components/FormErrorAlert";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import CustomLoading from "@/components/CustomLoading";
import { Skeleton } from "@/components/ui/skeleton";

import { renderToast } from "@/lib/utils";

import { searchNoteAction } from "@/actions/note.action";

import useKeyshortcut from "@/hooks/use-keyshortcut";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

const SemanticSearch = () => {
  const [state, action, pending] = useActionState(searchNoteAction, undefined);
  const searchNoteRef: RefObject<HTMLFormElement | null> = useRef(null);

  useEffect(() => {
    if (state)
      renderToast({
        status: state?.status,
        message: state?.message,
      });
  }, [state]);

  const searchButtonRef = useRef<HTMLDivElement>(null);

  useKeyshortcut(searchButtonRef, { key: "k", ctrlOrMeta: true });

  // Clear search results
  const handleClearSearch = () => {
    // Telling the server action to forget the search history
    const data = new FormData();
    data.set("clear", "true");

    startTransition(() => {
      action(data);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={searchButtonRef}
          tabIndex={0}
          className="flex gap-3 justify-between font-medium items-center w-max cursor-pointer rounded-lg transition-all duration-200 ease-in-out py-2 px-4 hover:ring-1 hover:ring-accent ring-0 bg-primary-foreground"
        >
          <MagnifyingGlassIcon className="size-4" weight="bold" />
          Search
          <KbdGroup className="rounded-full bg-white/10 gap-0!">
            <Kbd className="bg-transparent font-semibold p-0">⌘</Kbd>
            <Kbd className="bg-transparent font-semibold p-0">K</Kbd>
          </KbdGroup>
        </div>
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader className="hidden sr-only">
          <DialogTitle className="hidden sr-only">Search</DialogTitle>
          <DialogDescription className="hidden sr-only">
            semantic search within knowledge base
          </DialogDescription>
        </DialogHeader>

        <Form
          className="sticky top-0 border-x-3 border-theme-cyan shadow-[10px_10px_20px_rgba(0,0,0,.24)] rounded-lg p-0.5"
          ref={searchNoteRef}
          action={action}
        >
          <InputGroup className="rounded-lg">
            <InputGroupInput name="search" placeholder="eg. fitness summary" />
            <InputGroupAddon>
              <MagnifyingGlassIcon weight="bold" className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {pending && <CustomLoading className="scale-80" />}
            </InputGroupAddon>
          </InputGroup>
        </Form>
        {state?.errors?.queryString && (
          <div className="mt-2 mx-auto w-max">
            <FormErrorAlert
              status="error"
              title="Validation Error"
              description={state?.errors?.queryString}
            />
          </div>
        )}
        <div className="-mx-4 no-scrollbar h-[40vh] overflow-y-auto px-4">
          <div className="flex flex-col items-center justify-center gap-4 m-1">
            {state?.status === "success" && !pending ? (
              state.notesList?.map((note) => (
                <div
                  key={note._id}
                  className="relative outline-1 outline-teal-400/10 hover:outline-teal-400/30 focus-visible:outline-teal-400/30 rounded-lg px-2 py-1 cursor-pointer bg-background transition-all duration-300 ease-in-out"
                >
                  <Link
                    className="peer absolute inset-0 inline-block z-5"
                    href={`dashboard/${note._id}`}
                  />
                  <div className="overflow-ellipsis line-clamp-1 font-heading font-medium text-sm tracking-widest text-teal-600 dark:text-teal-800 mb-2">
                    {note.title}
                  </div>
                  <p className="overflow-ellipsis line-clamp-3 opacity-70">
                    {note.content}
                  </p>
                </div>
              ))
            ) : state?.status !== "success" && pending ? (
              new Array(5).fill("").map((x: string, i: number) => (
                <div
                  key={i}
                  className="outline outline-gray-400/10 rounded p-1 w-full"
                >
                  <Skeleton className="h-4.5 w-11/12 rounded-lg bg-primary/10" />
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-3.5 w-8/12 rounded-lg bg-primary/10" />
                    <Skeleton className="h-3.5 w-7/12 rounded-lg bg-primary/10" />
                  </div>
                </div>
              ))
            ) : (
              <EmptyPlaceholder
                type="search"
                title="Search Notes"
                description={`Semantic + Keyword + Recency score`}
              />
            )}
          </div>
        </div>
        <DialogFooter>
          {state?.notesList && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  disabled={pending}
                  className="size-8 rounded-full text-emerald-700 hover:text-red-600 dark:text-emerald-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  <TrashIcon weight="bold" className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="z-300">
                <p className="font-bold font-heading tracking-wider">
                  Clear Chat
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          <div className="bg-theme-cyan/10 shadow-[0px_2px_2px_rgba(0,0,0,.24)] rounded-full pt-1 px-1 flex justify-center items-center gap-1 text-primaryc cursor-not-allowed">
            <ArrowElbowDownLeftIcon weight="bold" className="size-3" />
            Search
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SemanticSearch;
