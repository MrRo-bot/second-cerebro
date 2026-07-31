import { SummaryConfigType } from "@/types/ai";

export const DB_NAME = "second-cerebro"; // project db name
export const PROJECT_NAME = "Second Cerebro"; // project name
export const MS_PER_DAY = 1000 * 60 * 60 * 24; //ms per day

export const MONGODB_URI = process.env.MONGODB_URI!; // MongoDB atlas uri

export const GROQ_API_KEY = process.env.GROQ_API_KEY; // Groq api key
export const GROQ_CHAT_MODEL = "openai/gpt-oss-120b"; //! best groq free model

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

export const SUMMARY_CONFIG: SummaryConfigType = {
  file: {
    temperature: 0.5,
    reasoning_effort: "low",
    max_completion_tokens: 1000,
    promptOverheadTokens: 500,
  },
  web: {
    temperature: 0.5,
    reasoning_effort: "low",
    max_completion_tokens: 1000,
    promptOverheadTokens: 600,
  },
  youtube: {
    temperature: 0.5,
    reasoning_effort: "medium",
    max_completion_tokens: 1200,
    promptOverheadTokens: 500,
  },
};

export const findEmoji = (hours: number): { icon: string; color: string } => {
  switch (true) {
    case hours >= 4 && hours < 12:
      return { icon: "🌞", color: "shadow-amber-300/20" };
    case hours >= 12 && hours < 18:
      return { icon: "😎", color: "shadow-amber-400/20" };
    case hours >= 18 && hours < 21:
      return { icon: "🌓", color: "shadow-slate-600/20" };
    case (hours >= 21 && hours <= 23) || hours < 4:
      return { icon: "🌚", color: "shadow-slate-400/20" };
    default:
      return { icon: "☠️", color: "shadow-zinc-300/50" };
  }
};
