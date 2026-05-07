"use client";

import Form from "next/form";
import {
  useActionState,
  useEffect,
  useState,
  useCallback,
  useRef,
  MouseEvent,
} from "react";
import { useDropzone } from "react-dropzone";
import gsap from "gsap";
import {
  CloudArrowUpIcon,
  XIcon,
  CheckCircleIcon,
  FilePdfIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import CustomLoading from "@/components/CustomLoading";

import { cn } from "@/lib/utils";
import { renderToast } from "@/lib/utils";

import { FileSummaryAction } from "@/actions/ai.action";

const AddPdf = () => {
  const [state, action, pending] = useActionState(FileSummaryAction, undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileCardRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.message) {
      renderToast({
        status: state?.status,
        message: state?.message,
      });
    }
  }, [state]);

  // handling file drop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // handling rejections (size or type errors)
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];

      let errorMessage = "Could not upload file.";
      if (error.code === "file-too-large") {
        errorMessage = "File is too large. Maximum size is 5MB.";
      } else if (error.code === "file-invalid-type") {
        errorMessage = "Invalid file type. Please upload a PDF.";
      }

      renderToast({
        status: "error",
        message: errorMessage,
      });
      return;
    }

    // handling success
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);

    // sync with native input
    if (hiddenInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      hiddenInputRef.current.files = dataTransfer.files;
    }

    // GSAP Animation
    setTimeout(() => {
      if (fileCardRef.current) {
        gsap.fromTo(
          fileCardRef.current,
          { opacity: 0, scale: 0.9, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" },
        );
      }
    }, 0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5MB
    accept: { "application/pdf": [".pdf"] },
    disabled: pending,
  });

  const removeFile = (e: MouseEvent) => {
    e.stopPropagation();
    gsap.to(fileCardRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      onComplete: () => {
        setSelectedFile(null);
        if (hiddenInputRef.current) hiddenInputRef.current.value = "";
      },
    });
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">PDF</CardTitle>
          <Badge variant="secondary" className="rounded-lg">
            Beta
          </Badge>
        </div>
        <CardDescription>
          Generate summary from unprotected text-based PDF.
        </CardDescription>
      </CardHeader>

      <CardContent className="text-muted-foreground">
        <Form action={action}>
          <Field className="space-y-4">
            <FieldLabel htmlFor="pdf">PDF file</FieldLabel>

            {/* hidden input */}
            <input
              id="pdf"
              name="file"
              type="file"
              ref={hiddenInputRef}
              className="hidden"
              required
            />

            {/* dropzone UI */}
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/20 hover:border-primary/40",
                pending && "opacity-50 cursor-not-allowed",
              )}
            >
              <input {...getInputProps()} />

              {!selectedFile ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="p-3 rounded-full bg-secondary mb-3">
                    <CloudArrowUpIcon
                      size={28}
                      weight="duotone"
                      className="text-primary"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Click or drag PDF here
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Maximum 5MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    <ArrowClockwiseIcon size={12} />
                    Change File
                  </div>

                  <div
                    ref={fileCardRef}
                    className="flex items-center gap-3 p-3 bg-background border rounded-lg shadow-sm"
                  >
                    <FilePdfIcon
                      size={32}
                      weight="duotone"
                      className="text-red-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate w-11/12 text-foreground">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {!pending && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={removeFile}
                      >
                        <XIcon size={16} />
                      </Button>
                    )}
                    {pending && (
                      <CheckCircleIcon
                        size={20}
                        weight="fill"
                        className="text-primary animate-pulse"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <FieldDescription>Select a PDF to summarize.</FieldDescription>

            <div className="pt-2">
              {pending ? (
                <Button
                  className="w-full md:max-w-max rounded-lg"
                  variant="destructive"
                  disabled
                >
                  <CustomLoading className="scale-75" text="Summarizing..." />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full md:max-w-max rounded-lg cursor-pointer"
                  variant="destructive"
                  disabled={!selectedFile}
                >
                  Summarize PDF
                </Button>
              )}
            </div>
          </Field>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddPdf;
