import { Db, MongoClient } from "mongodb";

import { DB_NAME, MONGODB_URI } from "@/lib/constants";

if (!MONGODB_URI) throw new Error("Please add your Mongo URI to .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// storing the mongo client in global variable so it wont be reiniliased if exists (due to HMR)

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export const dbPromise: Promise<Db> = clientPromise.then(async (client) => {
  const db = client.db(DB_NAME);

  /* 
     TODO: CHECK THIS
   * will moving these to a dedicated migration file in the future
   * Using background: true is good practice to avoid blocking the DB
   */
  try {
    await Promise.all([
      db
        .collection("users")
        .createIndex({ username: 1 }, { unique: true, background: true }),
      db.collection("notes").createIndex({ userId: 1 }),
      db.collection("notes").createIndex({ createdAt: -1 }),
      // Adding a text index for basic non-vector search
      db.collection("notes").createIndex({ content: "text", title: "text" }),
    ]);
  } catch (error) {
    console.error("Failed to create indexes:", error);
  }

  return db; // Returning the DB instance directly for easier use
});

// Exporting the client promise separately for Transactions (bulkWrite operations)
export const mongoClientPromise = clientPromise;
