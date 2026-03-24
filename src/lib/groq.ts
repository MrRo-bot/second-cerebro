import {
  pipeline,
  env,
  Tensor,
  FeatureExtractionPipeline,
} from "@xenova/transformers";
import OpenAI from "openai";

// Optional: can disable local model caching if needed (default is fine)
env.allowLocalModels = true;
env.allowRemoteModels = true;

const MODEL_NAME = "nomic-ai/nomic-embed-text-v1.5";
const DEFAULT_MATRYOSHKA_DIM = 512;

// ====================== Groq Client ======================
export const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ====================== Embedder singleton ======================
let embedder: FeatureExtractionPipeline | null = null;
let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getEmbedder() {
  if (embedder) return embedder;

  if (!embedderPromise) {
    console.log("Loading nomic-embed-text-v1.5 model... (quantized)");
    embedderPromise = pipeline("feature-extraction", MODEL_NAME, {
      quantized: true, // fast & small
    }).then((pipe) => {
      embedder = pipe;
      return pipe;
    });
  }

  return embedderPromise;
}

// ====================== Embedding Creator with Matryoshka ======================
export const embeddingCreator = async (
  title: string,
  content: string,
  matryoshkaDim: number = DEFAULT_MATRYOSHKA_DIM,
): Promise<number[]> => {
  const text = `${title}\n\n${content}`.trim();

  try {
    const extractor = await getEmbedder();

    const output: Tensor = await extractor(text, {
      pooling: "mean",
    });

    let embeddingTensor = output.slice(null, [0, matryoshkaDim]);

    embeddingTensor = embeddingTensor.normalize(2, -1); // L2 norm

    // 4. Convert to plain number[] for MongoDB
    return Array.from(embeddingTensor.data as Float32Array);
  } catch (error) {
    //toast
    console.error("Embedding creation failed:", error);
    throw new Error("Failed to generate embedding. Please try again.");
  }
};
