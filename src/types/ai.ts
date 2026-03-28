import { StatusType } from "@/types/types";

export type AIRagActionType =
  | {
      status: StatusType;
      message: string;
      response: { role: "user" | "assistant" | "system"; content: string }[];
    }
  | undefined;
