import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/lib/auth";
import { PUBLIC_AUTH_URL } from "@/lib/constants";

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  listSessions,
  revokeSession,
  revokeSessions,
  revokeOtherSessions,
  listAccounts,
  updateUser,
  deleteUser,
  changePassword,
} = createAuthClient({
  baseURL: PUBLIC_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include", //! critical: sends cookies
    mode: "cors", // DEFAULT BUT EXPLICITY SETTING DOESNT HURT
  },
  // for username and image fields if needed
  plugins: [inferAdditionalFields<typeof auth>()],
});
