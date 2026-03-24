import { ObjectId } from "mongodb";

export type AuthValidationType =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type User = {
  name: string;
  email: string;
  username: string;
  password: string;
  image?: string;
  notes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

export type SessionType = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    notes: ObjectId[];
    username: string;
  };
} | null;
