"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const AddDocx = () => {
  // if user uploads a pdf or doc (text based pdf and docs preferred)
  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

  //   const file = e.target.files?.[0];
  //   if (!file) return;

  // // Check size
  // if (file.size > MAX_FILE_SIZE) {
  //   alert("File is too large! Please upload a file smaller than 5MB.");
  //   e.target.value = ""; // Reset input
  //   return;
  // }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const result = await processFileAction(formData);

  //   if (result.status === "success" && result.response) {
  //     const { title, summary, content } = result.response;

  //     const finalHtml = `
  //       <h1>📄 ${title}</h1>
  //       <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 5px solid #2563eb;">
  //         <strong>Document Summary:</strong>
  //         ${summary}
  //       </div>
  //       <hr />
  //       ${content}
  //     `;

  //     editor.commands.setContent(finalHtml);
  //   }
  // };
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
        <Field>
          <FieldLabel className="sr-only hidden" htmlFor="docx">
            docx
          </FieldLabel>
          <Input id="docx" type="file" />
          <FieldDescription>Select a docx to upload.</FieldDescription>
        </Field>
      </CardContent>
    </Card>
  );
};

export default AddDocx;
