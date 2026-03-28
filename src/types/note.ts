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
      notesList: Note[];
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

export type Note = {
  _id: string;
  userId: string;
  title: string;
  content: string; //* markdown or TipTap JSON
  embedding: number[]; //* 64/128/256/512 for normic-embed-text-v1
  createdAt: Date;
};
