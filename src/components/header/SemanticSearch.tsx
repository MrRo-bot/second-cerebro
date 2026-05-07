"use client";

import Form from "next/form";
import Link from "next/link";
import { RefObject, useActionState, useEffect, useRef } from "react";
import {
  ArrowElbowDownLeftIcon,
  MagnifyingGlassIcon,
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

import { renderToast } from "@/lib/utils";

import { searchNoteAction } from "@/actions/note.action";

import useKeyshortcut from "@/hooks/use-keyshortcut";

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={searchButtonRef}
          tabIndex={0}
          className="flex gap-3 justify-between font-medium items-center w-max cursor-pointer rounded-full transition-all duration-200 ease-in-out py-2 px-4 hover:ring-1 hover:ring-accent ring-0 bg-background/50"
        >
          <MagnifyingGlassIcon className="size-4" weight="bold" />
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
          className="sticky top-0 bg-accent! rounded-lg p-0.5"
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
            {state?.status === "success" ? (
              state.notesList.map((note) => (
                <div
                  key={note._id}
                  className="relative outline outline-gray-400/10 hover:outline-gray-400/30 focus-visible:outline-gray-400/30 rounded p-1 cursor-pointer"
                >
                  <Link
                    className="peer absolute inset-0 inline-block z-5"
                    href={`dashboard/${note._id}`}
                  />
                  <div className="overflow-ellipsis line-clamp-1 font-heading font-semibold">
                    {note.title}
                  </div>
                  <p className="overflow-ellipsis line-clamp-2 opacity-70">
                    {note.content}
                  </p>
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
          <KbdGroup className="rounded-full bg-white/10 gap-0!">
            <Kbd className="bg-transparent text-white p-0 text-base">
              <ArrowElbowDownLeftIcon weight="bold" className="size-3" />
            </Kbd>
            <span className="pl-1 pr-2">Search</span>
          </KbdGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SemanticSearch;
