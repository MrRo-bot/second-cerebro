export type NoteActionType =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: {
        title?: string[];
        content?: string[];
      };
      message: string;
    }
  | undefined;

export type NoteSearchActionType =
  | {
      success: true;
      notesList: Note[];
      message: string;
    }
  | {
      success: false;
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
