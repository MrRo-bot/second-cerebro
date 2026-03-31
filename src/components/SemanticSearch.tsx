"use client";

import Form from "next/form";
import { RefObject, useActionState, useEffect, useRef } from "react";
import { SpinnerBallIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { searchNoteAction } from "@/actions/note.action";
import { renderToast } from "@/lib/utils";

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
    <div className="p-6 flex flex-col gap-5 items-center justify-center w-100">
      <Form
        ref={searchNoteRef}
        className="flex flex-col items-between gap-3 w-max"
        action={action}
      >
        <Field className="w-max">
          <FieldLabel htmlFor="search">Search similar notes</FieldLabel>
          <ButtonGroup>
            <Input id="search" name="search" placeholder="E.g. fitness" />
            <Button variant="outline" disabled={pending}>
              {pending && (
                <SpinnerBallIcon
                  weight="bold"
                  className="size-4 animate-spin"
                />
              )}
              {pending ? "Searching..." : "Search"}
            </Button>
            <Button
              onClick={() => searchNoteRef?.current?.reset()}
              type="button"
              className="cursor-pointer mx-auto w-max block"
              variant="ghost"
            >
              CANCEL
            </Button>
          </ButtonGroup>
        </Field>
      </Form>

      {state?.status === "success" &&
        state?.notesList.map(
          (note: { _id: string; title: string; content: string }) => (
            //TODO: have to find where to place search results in ui

            <div key={note._id} className="outline outline-gray-400 rounded">
              <div className="text-ellipsis line-clamp-1">{note.title}</div>
              <p className="text-ellipsis line-clamp-2">{note.content}</p>
            </div>
          ),
        )}
    </div>
  );
};

export default SemanticSearch;
