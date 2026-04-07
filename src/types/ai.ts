import { StatusType } from "@/types/types";

export type AIRagActionType =
  | {
      status: StatusType;
      message: string;
      response: { role: "user" | "assistant" | "system"; content: string }[];
    }
  | undefined;

export type ParseWebPageType = {
  status: StatusType;
  message: string;
  response?: {
    title: string | null | undefined;
    content: string;
    plainText: string;
  };
};

export type ParseFileType = {
  status: StatusType;
  message: string;
  response?: {
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
      };
    }
  | undefined;
