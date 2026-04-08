import { StatusType } from "@/types/types";

export type AuthActionType =
  | {
      status: StatusType;
      message: string;
    }
  | {
      status: StatusType;
      errors?: {
        name?: string[];
        email?: string[];
        username?: string[];
        password?: string[];
      };
      message: string;
    }
  | undefined;

export type UserType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  username: string;
  dateOfBirth?: Date | null | undefined;
  gender?: string | null | undefined;
  preferences?: string | null | undefined;
};

export type SessionType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};

export type AccountsType = {
  scopes: string[];
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  providerId: string;
  accountId: string;
};

export type SessionObjectType = {
  user: UserType;
  session: SessionType;
} | null;
