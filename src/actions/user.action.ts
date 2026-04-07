"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/*
 * get session
 * check session IF FAILS send error IF SUCCESS goto next
 * start deleting user and its related data
 * redirect to login route
 */
export const deleteUserAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      status: "error" as const,
      message: "Unauthorized",
    };
  }
  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        callbackURL: "/login",
      },
    });

    return redirect("/login?message=account-deleted&type=success");
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR:", error);
    return {
      status: "error" as const,
      //@ts-expect-error statusCode:number, status:string, body:{message:string}
      message: `${error?.statusCode} ${error?.status}: ${error?.body?.message}`,
    };
  }
};
