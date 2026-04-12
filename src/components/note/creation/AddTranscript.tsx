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
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { renderToast } from "@/lib/utils";

import { TranscriptSummaryAction } from "@/actions/ai.action";

const AddTranscript = () => {
  const [state, action, pending] = useActionState(
    TranscriptSummaryAction,
    undefined,
  );

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
        <CardTitle>Enter YouTube URL</CardTitle>
        <CardDescription>
          Generate summary of a YouTube video based on its transcript.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <Form action={action}>
          <Field>
            <FieldLabel htmlFor="webUrl">
              YouTube URL
              <Badge variant="secondary" className="ml-auto">
                Beta
              </Badge>
            </FieldLabel>
            <Input
              id="url"
              name="youtubeUrl"
              type="url"
              placeholder="https://example.com/"
            />
            {pending && (
              <Badge
                variant="destructive"
                className="rounded-full max-w-max mr-auto h-5"
              >
                <SpinnerBallIcon
                  weight="bold"
                  className="size-4 animate-spin origin-center mb-0.5"
                />
                <p>Processing...</p>
              </Badge>
            )}
          </Field>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTranscript;
