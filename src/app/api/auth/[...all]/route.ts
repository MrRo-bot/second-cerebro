import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

//* this catches all auth related routes
export const { GET, POST } = toNextJsHandler(auth);
