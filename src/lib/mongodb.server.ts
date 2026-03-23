import { MongoClient } from "mongodb";

//mongo db uri connection and cluster name
const uri = process.env.MONGODB_URI!;
const dbName = "second-cerebro";

if (!uri) throw new Error("MONGODB_URI is missing");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

//saving mongo client in global var so it dont get repeatedly created
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

//returning client and clientPromise (find why)
export const dbPromise = clientPromise.then(async (client) => {
  const db = client.db(dbName);

  //one time setting unique index to users
  await db
    .collection("users")
    .createIndex({ username: 1 }, { unique: true, background: true });

  return client;
});

// needed for transactions
export const mongoClientPromise = clientPromise;
