import { StatusType } from "@/types/types";

export type NoteActionType =
  | {
      status: StatusType;
      message: string;
      newNoteId?: string;
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

export type NoteFilterActionType =
  | {
      status: StatusType;
      notesList: NoteType[];
      allTags: string[];
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
  content: string; // markdown
  embedding: number[]; // 64/128/256/512 for normic-embed-text-v1
  tags: string[]; //3-5 tags related to note content
  createdAt: Date;
  updatedAt: Date;
};

export interface TagsManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}
