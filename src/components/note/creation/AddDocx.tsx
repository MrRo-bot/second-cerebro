"use client";

import Form from "next/form";
import { useActionState, useEffect } from "react";

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
import { Badge } from "@/components/ui/badge";
import CustomLoading from "@/components/CustomLoading";

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
    <Card className="rounded-lg">
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
            <FieldLabel htmlFor="docx">
              DOCX file
              <Badge variant="secondary" className="ml-auto rounded-lg pt-1">
                Beta
              </Badge>
            </FieldLabel>
            <Input
              id="docx"
              name="file"
              type="file"
              className="rounded-lg pt-1"
            />
            <FieldDescription>
              Select a document to summarize. *.docx file*
            </FieldDescription>
            {pending ? (
              <Button
                className="cursor-pointer mr-auto max-w-max flex items-center justify-center gap-2 rounded-lg"
                variant="destructive"
                disabled={pending}
              >
                <CustomLoading className="scale-70" text="Processing..." />
              </Button>
            ) : (
              <Button
                type="submit"
                className="cursor-pointer mr-auto max-w-max block rounded-lg pt-0.5"
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
