export type AIRagActionType =
  | {
      success: boolean;
      message: string;
      response: { role: "user" | "assistant" | "system"; content: string }[];
    }
  | undefined;
