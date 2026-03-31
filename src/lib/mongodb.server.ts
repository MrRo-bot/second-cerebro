import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "second-cerebro";

if (!uri) throw new Error("Please add your Mongo URI to .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

//* storing the mongo client in global variable so it wont be reiniliased if exists (due to HMR)

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const dbPromise: Promise<Db> = clientPromise.then(async (client) => {
  const db = client.db(dbName);

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
      //* Adding a text index for basic non-vector search
      db.collection("notes").createIndex({ content: "text", title: "text" }),
    ]);
  } catch (error) {
    console.error("Failed to create indexes:", error);
  }

  return db; //* Returning the DB instance directly for easier use
});

//* Exporting the client promise separately for Transactions (bulkWrite operations)
export const mongoClientPromise = clientPromise;
