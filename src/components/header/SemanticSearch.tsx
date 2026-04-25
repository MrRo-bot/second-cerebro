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

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full h-full">
        <div className="flex gap-2 justify-start items-center p-2">
          <MagnifyingGlassIcon className="size-4" weight="bold" />
          <span className="text-xs">Search</span>
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
                {pending && <CustomLoading />}
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
                  <div className="text-ellipsis line-clamp-1">{note.title}</div>
                  <p className="text-ellipsis line-clamp-2">{note.content}</p>
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
