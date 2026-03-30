"use client";

import Form from "next/form";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import CancelButton from "@/components/CancelButton";
import { searchNoteAction } from "@/actions/note.action";
import { SpinnerBallIcon } from "@phosphor-icons/react";
import { renderToast } from "@/lib/utils";

const SemanticSearch = () => {
  const [state, action, pending] = useActionState(searchNoteAction, undefined);
  const searchNoteRef = useRef(null);

  useEffect(() => {
    if (state)
      renderToast({
        status: state?.status,
        message: state?.message,
      });
  }, [state]);

  return (
    <>
      {state?.status === "success" &&
        state?.notesList.map(
          (note: { _id: string; title: string; content: string }) => (
            //TODO: have to find where to place search results in ui

            <div key={note._id}>
              <div>{note.title}</div>
              <div>{note.content}</div>
            </div>
          ),
        )}

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
            <CancelButton ref={searchNoteRef} />
          </ButtonGroup>
        </Field>
      </Form>
    </>
  );
};

export default SemanticSearch;
