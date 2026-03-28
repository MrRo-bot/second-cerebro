import {
  pipeline,
  env,
  Tensor,
  FeatureExtractionPipeline,
} from "@xenova/transformers";
import OpenAI from "openai";

import { notes } from "@/lib/collections";
import { ObjectId } from "mongodb";

//? Optional: can disable local model caching if needed (default is fine)
env.allowLocalModels = true;
env.allowRemoteModels = true;

const MODEL_NAME = "nomic-ai/nomic-embed-text-v1.5";
const DEFAULT_MATRYOSHKA_DIM = 512;

//* Groq Client
export const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

//* Embedder singleton
let embedder: FeatureExtractionPipeline | null = null;
let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getEmbedder() {
  if (embedder) return embedder;

  if (!embedderPromise) {
    console.log("Loading nomic-embed-text-v1.5 model... (quantized)");
    embedderPromise = pipeline("feature-extraction", MODEL_NAME, {
      quantized: true, //* fast & small
    }).then((pipe) => {
      embedder = pipe;
      return pipe;
    });
  }

  return embedderPromise;
}

//* Embedding Creator with Matryoshka
export const embeddingCreator = async (
  text: string,
  matryoshkaDim: number = DEFAULT_MATRYOSHKA_DIM,
): Promise<number[]> => {
  try {
    const extractor = await getEmbedder();

    const output: Tensor = await extractor(text, {
      pooling: "mean",
    });

    let embeddingTensor = output.slice(null, [0, matryoshkaDim]);

    embeddingTensor = embeddingTensor.normalize(2, -1); //* L2 norm

    //* Converting to plain number[] for MongoDB
    return Array.from(embeddingTensor.data as Float32Array);
  } catch (error) {
    //TODO: CAN BE DONE SOMETHING WITH IT
    console.error("Embedding creation failed:", error);
    throw new Error("Failed to generate embedding,Please try again");
  }
};

export const semanticSearchQuery = async (
  query: string,
  userID?: ObjectId,
  limit = 50,
  numCandidates = 200,
) => {
  /*
   * vector search over mentioned users collection
   *   +
   * keyword search over mentioned users collection
   *   +
   * fusion
   *
   *   PREREQUISITES:
   * • Keeping numCandidates between 100–400
   * • Using limit around 30–80 before reranking
   * • Storing updatedAt for recency boosting
   */
  const queryVector = await embeddingCreator(query);

  const searchResults = await notes
    .aggregate([
      //* vector search settings
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates,
          limit,
          filter: { userId: { $eq: userID } },
        },
      },

      //* VECTOR SEARCH SCORES
      {
        $addFields: {
          vectorScore: { $meta: "vectorSearchScore" },
        },
      },

      //!  IMPORTANT: Set a minimum threshold.
      //*  Vector search ALWAYS returns results, even if they aren't relevant.
      {
        $match: { vectorScore: { $gte: 0.6 } },
      },

      //* KEYWORD SEARCH SCORES
      {
        $addFields: {
          keywordScore: {
            $cond: [
              {
                $regexMatch: {
                  input: "$content",
                  regex: query,
                  options: "i",
                },
              },
              1,
              0,
            ],
          },
        },
      },

      //* RECENCY SEARCH SCORES
      {
        $addFields: {
          recencyScore: {
            $divide: [
              1,
              {
                $add: [
                  1,
                  {
                    $divide: [
                      { $subtract: [new Date(), "$updatedAt"] },
                      1000 * 60 * 60 * 24,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      //* FINAL OUTPUT
      {
        $addFields: {
          finalScore: {
            $add: [
              { $multiply: ["$vectorScore", 0.75] },
              { $multiply: ["$keywordScore", 0.15] },
              { $multiply: ["$recencyScore", 0.1] },
            ],
          },
        },
      },

      //* sorted by descending order (-1)
      {
        $sort: { finalScore: -1 },
      },

      //* number of results returned
      {
        $limit: 10,
      },
    ])
    .toArray();

  return searchResults;
};
