import { StatusType } from "@/types/types";

export type NoteActionType =
  | {
      status: StatusType;
      message: string;
    }
  | {
      status: StatusType;
      errors?: {
        title?: string[];
        content?: string[];
      };
      message: string;
    }
  | undefined;

export type NoteSearchActionType =
  | {
      status: StatusType;
      notesList: NoteType[];
      message: string;
    }
  | {
      status: StatusType;
      errors?: {
        queryString?: string[];
      };
      message: string;
    }
  | undefined;

export type NoteType = {
  _id: string;
  userId: string;
  title: string;
  content: string; //* markdown
  embedding: number[]; //* 64/128/256/512 for normic-embed-text-v1
  createdAt: Date;
};
