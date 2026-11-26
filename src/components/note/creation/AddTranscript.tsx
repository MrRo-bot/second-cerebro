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

import { TranscriptSummaryAction } from "@/actions/ai.action";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddTranscript = () => {
  const [state, action, pending] = useActionState(
    TranscriptSummaryAction,
    undefined,
  );

  useEffect(() => {
    if (!state) return;

    if (state.status === "error") {
      console.error("Transcript failed: ", JSON.stringify(state));
    }

    renderToast({
      status: state.status,
      message: state.message,
    });
  }, [state]);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Enter YouTube URL</CardTitle>
        <CardDescription>
          Generate summary of a YouTube video based on its transcript.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {process.env.NODE_ENV === "development" ? (
          <Form action={action}>
            <Field>
              <FieldLabel htmlFor="webUrl">
                YouTube URL
                <Badge variant="secondary" className="ml-auto rounded-lg pt-1">
                  Beta
                </Badge>
              </FieldLabel>
              <Input
                id="webUrl"
                name="youtubeUrl"
                type="url"
                placeholder="https://example.com/"
                className="rounded-lg"
              />
              <div className="pt-2">
              {pending ? (
                <Button
                  className="block w-full md:w-max mx-auto rounded-lg h-7"
                  variant="destructive"
                  disabled
                >
                  <CustomLoading className="scale-75" text="Summarizing..." />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="block w-full md:w-max mx-auto rounded-lg cursor-pointer h-7"
                  variant="destructive"
                  disabled={pending}
                >
                  Summarize Video
                </Button>
              )}
            </div>
            </Field>
          </Form>
        ) : (
          <Label className="text-sm text-theme-red bg-red-50 rounded-md w-max mx-auto px-2 pb-1 pt-1.5">
            Not Available for production 🥹(not a free resource)😥
          </Label>
        )}
      </CardContent>
    </Card>
  );
};

export default AddTranscript;
