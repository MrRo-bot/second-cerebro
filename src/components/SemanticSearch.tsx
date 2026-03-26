"use client";

import Form from "next/form";
import { useActionState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import CancelButton from "@/components/CancelButton";
import { searchNoteAction } from "@/actions/note.action";
import { SpinnerBallIcon } from "@phosphor-icons/react";

const SemanticSearch = () => {
  const [state, action, pending] = useActionState(searchNoteAction, undefined);
  const searchNoteRef = useRef(null);

  return state?.success === false ? (
    <div className="text-red-500">{state.message}</div>
  ) : (
    <>
      {state?.notesList.map((note) => {
        //TODO: have to find where to place search results in ui
        return (
          <div key={note._id}>
            <div>{note.title}</div>
            <div>{note.content}</div>
          </div>
        );
      })}
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
                <SpinnerBallIcon weight="fill" className="animate-spin" />
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
