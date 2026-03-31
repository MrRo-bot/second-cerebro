"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { SignupFormSchema, SigninFormSchema } from "@/lib/definitions";

import { AuthActionType } from "@/types/user";

/*
 * Sign up action:
 * - getting formData
 * - validating values using zod validator IF FAILS sends errors IF SUCCESS goto next
 * - sign up using signUpEmail() IF FAILS sends error IF SUCCESS redirects to /dashboard
 */
export const signupAction = async (
  state: AuthActionType,
  formData: FormData,
) => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = SignupFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      status: "error" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check the fields and try again.",
    };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: validatedFields.data, //* zod already stripped extra fields
      headers: await headers(),
    });
    if (!result) {
      return {
        status: "error" as const,
        message: "Sign-up failed",
      };
    }
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return {
      status: "error" as const,
      message: "Technical error, Try again",
    };
  }

  redirect("/dashboard?message=Welcome!&type=success");
};

/*
 * Sign in action:
 * - getting formData
 * - validating values using zod validator IF FAILS sends errors IF SUCCESS goto next
 * - sign up using signInEmail() IF FAILS sends error IF SUCCESS redirects to /dashboard
 */
export const signinAction = async (
  state: AuthActionType,
  formData: FormData,
) => {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = SigninFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      status: "error" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid credentials.",
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: validatedFields.data,
    });

    if (!result) {
      return {
        status: "error" as const,
        message: "Invalid email or password.",
      };
    }
  } catch (error) {
    console.error("SIGNIN_ERROR:", error);
    return {
      status: "error" as const,
      message: "Auth service unavailable.",
    };
  }

  redirect("/dashboard?message=Welcome!&type=success");
};
