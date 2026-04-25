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
    <Card>
      <CardHeader>
        <CardTitle>Enter URL</CardTitle>
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
              <Badge variant="secondary" className="ml-auto">
                Beta
              </Badge>
            </FieldLabel>
            <Input
              id="webUrl"
              name="webUrl"
              type="url"
              placeholder="https://example.com/"
            />
            {pending && (
              <Badge
                variant="destructive"
                className="rounded-full max-w-max mr-auto h-5"
              >
                <CustomLoading text="Processing..." />
              </Badge>
            )}
          </Field>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddUrl;
