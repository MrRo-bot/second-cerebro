import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "@/lib/auth";

export const { signIn, signUp, signOut, useSession, updateUser } =
  createAuthClient({
    baseURL: "http://localhost:3000",
    fetchOptions: {
      credentials: "include", //! critical: sends cookies
      mode: "cors", //* usually needed
    },
    //* for username and image fields if needed
    plugins: [inferAdditionalFields<typeof auth>()],
  });
