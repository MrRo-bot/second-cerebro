"use client";

import Form from "next/form";
import { RefObject, useActionState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

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

        <div className="no-scrollbar h-[40vh] overflow-y-auto">
          <Form
            className="sticky top-0 bg-accent!"
            ref={searchNoteRef}
            action={action}
          >
            <InputGroup>
              <InputGroupInput
                name="search"
                placeholder="eg. fitness summary"
              />
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
          <div className="flex flex-col items-center justify-center gap-4 m-1">
            {state?.status === "success" ? (
              state?.notesList.map((note) => (
                <div
                  key={note._id}
                  className="outline outline-gray-400/10 rounded"
                >
                  <div className="overflow-ellipsis line-clamp-1">
                    {note.title}
                  </div>
                  <p className="overflow-ellipsis line-clamp-2">
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
        <DialogFooter className="justify-start!">
          <KbdGroup className="gap-2">
            <Kbd className="bg-accent! text-dark! dark:text-white! text-lg">
              ⏎
            </Kbd>
            Search
          </KbdGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SemanticSearch;
