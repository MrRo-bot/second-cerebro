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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;

  const validatedFields = SignupFormSchema.safeParse({
    fullName,
    email,
    username,
    password,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation errors",
    };
  }

  const result = await auth.api.signUpEmail({
    body: { email, password, name: fullName, username },
    headers: await headers(),
  });

  if (!result) {
    return {
      success: false,
      message: "Signup failed",
    };
  }

  redirect("/dashboard");
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = SigninFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation errors",
    };
  }

  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!result) {
    return {
      success: false,
      message: "Sign in failed",
    };
  }

  redirect("/dashboard");
};
