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

const AddPdf = () => {
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
        <CardTitle>PDF</CardTitle>
        <CardDescription>
          Generate summary from unprotected text based PDF. (Images will be
          ignored)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <Form action={action}>
          <Field>
            <FieldLabel className="sr-only hidden" htmlFor="pdf">
              PDF FILE
            </FieldLabel>
            <Input id="pdf" name="file" type="file" />
            <FieldDescription>Select a PDF to summarize.</FieldDescription>
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

export default AddPdf;
