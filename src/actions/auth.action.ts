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
      status: "warning" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please check the fields and try again.",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: validatedFields.data,
      headers: await headers(),
    });
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);

    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
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
      status: "warning" as const,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid credentials.",
    };
  }

  try {
    await auth.api.signInEmail({
      body: validatedFields.data,
    });
  } catch (error: unknown) {
    console.error("SIGNIN_ERROR:", error);
    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
    };
  }

  redirect("/dashboard?message=Welcome!&type=success");
};
