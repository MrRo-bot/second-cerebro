"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { SignupFormSchema, SigninFormSchema } from "@/lib/definitions";
import { AuthValidationType } from "@/types/user";

export const signupAction = async (
  state: AuthValidationType,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const username = formData.get("username") as string;

  // VALIDATING SIGN UP FIELDS USING ZOD
  const validatedFields = SignupFormSchema.safeParse({
    fullName,
    email,
    username,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //typical fetch post request like infrastructure
  const result = await auth.api.signUpEmail({
    body: { email, password, name: fullName, username },
    headers: await headers(),
  });

  if (!result) {
    return { error: "Signup failed" };
  }

  //only redirect when above code is done
  redirect("/dashboard");
};

export const signinAction = async (
  state: AuthValidationType,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // VALIDATING SIGN IN FIELDS USING ZOD
  const validatedFields = SigninFormSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  //typical fetch post request like infrastructure
  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!result) {
    return { error: "Sign in failed" };
  }

  //only redirect when above code is done
  redirect("/dashboard");
};
