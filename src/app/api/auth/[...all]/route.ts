import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

//find whats the use of this
export const { GET, POST } = toNextJsHandler(auth);
