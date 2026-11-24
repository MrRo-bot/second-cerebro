"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
const { revalidatePath } = await import("next/cache");

import { auth } from "@/lib/auth";
import { users } from "@/lib/collections";
import { ObjectId } from "mongodb";
import { normalizeError } from "@/lib/utils";

export async function updateProfileImage(imageUrl: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: "error" as const, message: "Unauthorized" };
    }

    if (!imageUrl?.trim()) {
      return { success: "warning" as const, message: "Image URL is required" };
    }

    try {
      new URL(imageUrl);
    } catch {
      return { success: "error" as const, message: "Please enter a valid URL" };
    }

    const updatedUser = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          image: imageUrl.trim(),
          updatedAt: new Date(),
        },
      },
    );

    if (!updatedUser) {
      return { success: "error" as const, message: "User not found" };
    }

    revalidatePath("/dashboard/settings/profile");

    return { success: true, message: "Profile picture updated!" };
  } catch (error) {
    console.error("updateProfileImage error: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to update profile image",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
}

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
    console.error("DELETE_ACCOUNT_ERROR: ", error);

    const info = normalizeError(error);

    return {
      status: "error" as const,
      message: info.message || "Failed to delete the account",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }
};
