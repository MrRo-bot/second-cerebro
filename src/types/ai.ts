import { StatusType } from "@/types/types";
import { StreamableValue } from "@ai-sdk/rsc";

export type AIRagActionType =
  | {
      status: StatusType;
      message: string;
      response: {
        role: "user" | "assistant" | "system";
        content: string | StreamableValue<string>;
      }[];
    }
  | undefined;

export type ParseWebPageType = {
  status: StatusType;
  message: string;
  response?: {
    type: "web";
    title: string | null | undefined;
    content: string;
    plainText: string;
  };
};

export type ParseFileType = {
  status: StatusType;
  message: string;
  response?: {
    type: "pdf" | "word";
    title: string;
    content: string;
  };
};

export type ParseTranscriptType = {
  status: StatusType;
  message: string;
  response?: {
    type: "youtube";
    title: string;
    content: string;
  };
};

export type SummaryActionType =
  | {
      status: StatusType;
      message: string;
      response?: {
        title: string | null | undefined;
        summary: string;
        content: string;
        size?: string;
      };
    }
  | undefined;

export type GraphNode = {
  x?: number;
  y?: number;
  z?: number;
  id: string;
  name: string;
  type: "note" | "tag";
  val?: number;
  tags?: string[];
};

export type GraphLink = {
  source: string;
  target: string;
  value: number;
  type: "tag" | "semantic";
};

export type ContentType = "file" | "web" | "youtube";

export type SummaryConfigType = Record<
  ContentType,
  {
    temperature: number;
    reasoning_effort: "low" | "medium" | "high";
    max_completion_tokens: number;
    promptOverheadTokens: number;
  }
>;
