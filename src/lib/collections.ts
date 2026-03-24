import { dbPromise } from "@/lib/mongodb.server";

//check if users and notes exists
const client = await dbPromise;
const db = client.db("second-cerebro");
export const users = db.collection("users");
export const notes = db.collection("notes");
