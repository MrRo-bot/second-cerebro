"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
const { revalidatePath } = await import("next/cache");

import { auth } from "@/lib/auth";
import { getCollections } from "@/lib/collections";
import { ObjectId } from "mongodb";
import { normalizeError } from "@/lib/utils";

export const updateProfileImage=async(
  imageUrl: string|undefined,
): Promise<
  | { status: "success"; message: string }
  | { status: "error" | "warning"; message: string; debug?: unknown }
> => {
  const { users } = await getCollections();
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    const trimmed = imageUrl?.trim();
    if (!trimmed) {
      return { status: "warning", message: "Image URL is required" };
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return { status: "error", message: "Please enter a valid URL" };
    }

    // Block javascript:, data:, file:, etc.
    if (parsed.protocol !== "https:") {
      return { status: "error", message: "Image URL must start with https://" };
    }

    if (!ObjectId.isValid(session.user.id)) {
      return { status: "error", message: "Invalid user" };
    }

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: parsed.toString(), updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return { status: "error", message: "User not found" };
    }

    revalidatePath("/dashboard/settings/profile");

    return { status: "success", message: "Profile picture updated!" };
  } catch (error) {
    console.error("updateProfileImage error: ", error);

    const info = normalizeError(error);
    return {
      status: "error",
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
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR: ", error);

    const info = normalizeError(error);
    return {
      status: "error" as const,
      message: info.message || "Failed to delete the account",
      ...(process.env.NODE_ENV !== "production" && { debug: info }),
    };
  }

  return redirect("/login?message=Account%20Deleted&type=success");
};
