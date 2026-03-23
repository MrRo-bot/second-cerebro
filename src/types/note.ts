export type Note = {
  _id: string;
  userId: string;
  title: string;
  content: string; // markdown or TipTap JSON
  embedding: number[]; // 1536-dim
  createdAt: Date;
};
