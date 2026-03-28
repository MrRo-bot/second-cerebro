import { StatusType } from "@/types/types";

export type AuthActionType =
  | {
      status: StatusType;
      message: string;
    }
  | {
      status: StatusType;
      errors?: {
        fullName?: string[];
        email?: string[];
        username?: string[];
        password?: string[];
      };
      message: string;
    }
  | undefined;

export type User = {
  name: string;
  email: string;
  username: string;
  password: string;
  image?: string;
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
    username: string;
  };
} | null;
