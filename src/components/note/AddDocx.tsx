"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";
import { SpinnerBallIcon } from "@phosphor-icons/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { renderToast } from "@/lib/utils";

import { FileSummaryAction } from "@/actions/ai.action";

const AddDocx = () => {
  const [state, action, pending] = useActionState(FileSummaryAction, undefined);

  useEffect(() => {
    if (state?.message) {
      renderToast({
        status: state?.status,
        message: state?.message,
      });
    }
  }, [state]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>DOCS</CardTitle>
        <CardDescription>
          Generate summary from unprotected text based word docs. (Images will
          be ignored)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <Form action={action}>
          <Field>
            <FieldLabel className="sr-only hidden" htmlFor="docx">
              WORD FILE
            </FieldLabel>
            <Input id="docx" name="file" type="file" />
            <FieldDescription>
              Select a document to summarize. *.docx file*
            </FieldDescription>
            {pending ? (
              <Button
                className="cursor-pointer mr-auto max-w-max flex items-center justify-center gap-2"
                variant="destructive"
                disabled={pending}
              >
                <SpinnerBallIcon
                  weight="bold"
                  className="size-4 animate-spin"
                />{" "}
                Processing...
              </Button>
            ) : (
              <Button
                type="submit"
                className="cursor-pointer mr-auto max-w-max block"
                variant="destructive"
                disabled={pending}
              >
                Add
              </Button>
            )}
          </Field>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddDocx;
