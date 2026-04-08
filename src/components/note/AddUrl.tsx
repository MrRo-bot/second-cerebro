"use client";

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

const AddUrl = () => {
  // if user enters url for creating notes
  // const handleClip = async (url:string) => {
  //   const result = await WebSummaryAction(url);

  //   if (result.success && result.data) {
  //     const { title, summary, fullContent } = result.data;

  //     // Create a structured note for your Second Cerebro
  //     const editorContent = `
  //     <h1>${title}</h1>
  //     <div class="ai-summary" style="background: #f9fafb; padding: 10px; border-left: 4px solid #3b82f6;">
  //       ${summary}
  //     </div>
  //     <br />
  //     ${fullContent}
  //   `;

  //     editor?.commands.setContent(editorContent);
  //   }
  // };

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
        <Field>
          <FieldLabel htmlFor="webUrl">
            Webpage URL
            <Badge variant="secondary" className="ml-auto">
              Beta
            </Badge>
          </FieldLabel>
          <Input id="webUrl" type="url" placeholder="https://example.com/" />
        </Field>
      </CardContent>
    </Card>
  );
};

export default AddUrl;
