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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomLoading from "@/components/CustomLoading";

import { renderToast } from "@/lib/utils";

import { WebSummaryAction } from "@/actions/ai.action";

const AddUrl = () => {
  const [state, action, pending] = useActionState(WebSummaryAction, undefined);

  useEffect(() => {
    if (state?.message) {
      renderToast({
        status: state?.status,
        message: state?.message,
      });
    }
  }, [state]);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">Enter URL</CardTitle>
        <CardDescription>
          It will get the text from the webpage using screen reader and
          summarize the whole content for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <Form action={action}>
          <Field>
            <FieldLabel htmlFor="webUrl">
              Webpage URL
              <Badge variant="secondary" className="ml-auto rounded-xl pt-1">
                Beta
              </Badge>
            </FieldLabel>
            <Input
              id="webUrl"
              name="webUrl"
              type="url"
              placeholder="https://example.com/"
              className="rounded-xl"
            />
          </Field>
        </Form>
        {pending && (
          <Badge
            variant="secondary"
            className="rounded-full w-max mx-auto block h-7 mt-2"
          >
            <CustomLoading className="scale-70" text="Processing..." />
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default AddUrl;
