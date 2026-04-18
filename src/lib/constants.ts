export const DB_NAME = "second-cerebro"; // project db name
export const PROJECT_NAME = "Second Cerebro"; // project name
export const MS_PER_DAY = 1000 * 60 * 60 * 24; //ms per day

export const MONGODB_URI = process.env.MONGODB_URI!; // MongoDB atlas uri

export const GROQ_API_KEY = process.env.GROQ_API_KEY; // Groq api key

export const PUBLIC_AUTH_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL; // Next.js public auth url

export const G_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!; // Google client id
export const G_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!; // Google client secret

export const MAX_FILE_SIZE = 5 * 1024 * 1024; //! 5MB

export const MODEL_NAME = "nomic-ai/nomic-embed-text-v1.5"; //! best model for text embeddings
export const DEFAULT_MATRYOSHKA_DIM = 512; //!safer option for free project

export const frameworks = [
  "Last Updated",
  "Last Created",
  "A-Z",
  "Z-A",
] as const;
