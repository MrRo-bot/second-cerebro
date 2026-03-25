// import { Document } from "mongodb";

export type NoteValidationType =
  | {
      errors?: {
        title?: string[];
        content?: string[];
      };
      message?: string;
    }
  | undefined;

export type NoteSearchActionType =
  | {
      success: true;
      notesList: Note[];
    }
  | {
      success: false;
      errors?: {
        queryString?: string[];
      };
      message?: string;
    }
  | undefined;

export type Note = {
  _id: string;
  userId: string;
  title: string;
  content: string; // markdown or TipTap JSON
  embedding: number[]; // 1536-dim
  createdAt: Date;
};
