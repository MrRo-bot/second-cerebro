import { dbPromise } from "@/lib/mongodb.server";

//* check if users and notes exists if no it creates it if yes then gets reference that can be used everywhere
const db = await dbPromise;
export const users = db.collection("users");
export const notes = db.collection("notes");
