import {
  pipeline,
  env,
  Tensor,
  FeatureExtractionPipeline,
} from "@xenova/transformers";
// TODO: might need huggingface/transformers instead of this

import OpenAI from "openai";
import { ObjectId } from "mongodb";
import { Readability } from "@mozilla/readability";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

import { notes } from "@/lib/collections";
import { escapeRegex } from "@/lib/utils";

import { ParseFileType, ParseWebPageType } from "@/types/ai";

import { DEFAULT_MATRYOSHKA_DIM, GROQ_API_KEY, MODEL_NAME } from "./constants";

//? Optional: can disable local model caching if needed (default is fine)
env.allowLocalModels = true;
env.useBrowserCache = false; // ← Disable browser cache (critical for server)
env.useFSCache = true; // ← Enable filesystem cache instead (Node.js friendly)
env.allowRemoteModels = true;

// TODO:Optional: Sets a custom cache directory (recommended for production)
env.cacheDir = "./.cache/transformers"; // Creates .cache folder in project root

// Groq Client
export const groqClient = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Embedder singleton
// TODO: MIGHT NEED SEPARATE AWS SERVER FOR THIS
let embedder: FeatureExtractionPipeline | null = null;
let embedderPromise: Promise<FeatureExtractionPipeline> | null = null;

// embedding pipeline creation
const getEmbedder = async (): Promise<FeatureExtractionPipeline> => {
  // return cached instance if already loaded
  if (embedder) return embedder;

  // if loading is already in progress, wait for it
  if (embedderPromise) {
    return embedderPromise;
  }

  // start loading (only happens once)
  console.log("Loading nomic-embed-text-v1.5 model... (quantized)");

  embedderPromise = pipeline("feature-extraction", MODEL_NAME, {
    quantized: true,
    // I can add progress callback if i want
    // progress_callback: (data) => console.log(`Progress: ${data.progress}%`),
  }).then((pipe) => {
    embedder = pipe;
    console.log("✅ Nomic embedding model loaded and cached successfully");
    return pipe;
  });

  return embedderPromise;
};

// Embedding Creator with Matryoshka
export const embeddingCreator = async (
  text: string,
  matryoshkaDim: number = DEFAULT_MATRYOSHKA_DIM,
): Promise<number[]> => {
  try {
    const extractor = await getEmbedder();

    const output: Tensor = await extractor(text, {
      pooling: "mean",
      normalize: true, // let the pipeline handle normalization if possible
    });

    // apply matryoshka dimensionality reduction
    let embeddingTensor = output.slice(null, [0, matryoshkaDim]);
    embeddingTensor = embeddingTensor.normalize(2, -1); // L2 norm

    // Converting to plain number[] for MongoDB
    return Array.from(embeddingTensor.data as Float32Array);
  } catch (error) {
    //TODO: CAN BE DONE SOMETHING WITH IT
    console.error("Embedding creation failed:", error);
    throw new Error("Failed to generate embedding,Please try again");
  }
};

// TODO:Optional: Preload the model on server startup (recommended)
// export const preloadEmbeddingModel = async () => {
//   try {
//     await getEmbedder();
//   } catch (error) {
//     console.error("Failed to preload embedding model:", error);
//   }
// };

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/*
 * vector search over mentioned users collection
 *   +
 * keyword search over mentioned users collection
 *   +
 * fusion with recency algorithm
 *
 *   PREREQUISITES:
 * • Keeping numCandidates between 100–400
 * • Using limit around 30–80 before reranking
 * • Storing updatedAt for recency boosting
 */
export const semanticSearchQuery = async (
  query: string,
  userID?: ObjectId,
  limit = 50,
  numCandidates = 200,
) => {
  // ESCAPE THE QUERY FOR REGEX SAFETY
  const safeQuery = escapeRegex(query);
  const queryVector = await embeddingCreator(safeQuery);

  const searchResults = await notes
    .aggregate([
      // vector search settings
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

      // VECTOR SEARCH SCORES
      {
        $addFields: {
          vectorScore: { $meta: "vectorSearchScore" },
        },
      },

      //! IMPORTANT: Set a minimum threshold.
      // Vector search ALWAYS returns results, even if they aren't relevant.
      {
        $match: { vectorScore: { $gte: 0.6 } },
      },

      // KEYWORD SEARCH SCORES
      {
        $addFields: {
          // Binary score for keyword presence
          keywordScore: {
            $cond: [
              {
                $regexMatch: {
                  input: "$content",
                  regex: safeQuery,
                  options: "i",
                },
              },
              1,
              0,
            ],
          },
          // Decay score: 1 / (1 + days_old)
          recencyScore: {
            $divide: [
              1,
              {
                $add: [
                  1,
                  {
                    $divide: [
                      { $subtract: [new Date(), "$updatedAt"] },
                      MS_PER_DAY,
                    ],
                  },
                ],
              },
            ],
          },
        },
      },

      // FINAL OUTPUT
      {
        $addFields: {
          finalScore: {
            $add: [
              { $multiply: ["$vectorScore", 0.7] }, // Primary relevance
              { $multiply: ["$keywordScore", 0.2] }, // Exact phrase boost
              { $multiply: ["$recencyScore", 0.1] }, // Freshness nudge
            ],
          },
        },
      },

      // sorted by descending order (-1)
      {
        $sort: { finalScore: -1 },
      },

      // number of results returned
      {
        $limit: 10,
      },
    ])
    .toArray();

  return searchResults;
};

/*
 * Extracts semantic text from an HTML string using JSDOM.
 */
const getSemanticTextFromWebpage = async (html: string): Promise<string> => {
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Removing non-content tags
  const tagsToRemove = ["script", "style", "iframe", "noscript"];
  tagsToRemove.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  });

  return doc.body.textContent?.replace(/\s+/g, " ").trim() || "";
};

/*
 * getting data from html IF FAIL send error IF SUCCESS goto next
 * purifying data and creating semantic text for LLM
 * returning title content and plainText
 */
export const parseWebPage = async (url: string): Promise<ParseWebPageType> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const html = await res.text();

    const { JSDOM } = await import("jsdom");
    const { default: DOMPurify } = await import("isomorphic-dompurify");

    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.content)
      throw new Error("Failed to parse the website");

    //title siteName html content se link and maybe some part in html useful

    // Purifying for Tiptap
    const cleanedContent = DOMPurify.sanitize(article.content, {
      // TODO:for getting title from head tag maybe?
      WHOLE_DOCUMENT: true,
    });

    // Extracting Plain Text for LLM (semantic extraction)
    // TODO:maybe need trycatch
    const llmReadyText = (
      await getSemanticTextFromWebpage(article.content)
    ).substring(0, 12000);

    return {
      status: "success",
      message: "Web parsing successful",
      response: {
        title: article.title,
        content: cleanedContent,
        plainText: llmReadyText,
      },
    };
  } catch (error) {
    console.error("Web parsing failed:", error);
    return {
      status: "error",
      //@ts-expect-error {status:StatusType, message:string}
      message: "Web parsing failed: " + error?.message,
    };
  }
};

/*
 * making arrayBuffer from file
 * creating buffer from arrayBuffer
 * getting file name and file type
 * if file is pdf IF SUCCESS parsing text from pdf
 * if file is doc IF SUCCESS parsing text from doc
 * IF ANY FAIL send error IF SUCCESS send parsed data
 */
export const parseLocalFile = async (file: File): Promise<ParseFileType> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = file.type;
  const fileName = file.name;

  try {
    if (fileType === "application/pdf") {
      const data = new PDFParse({ data: buffer });
      const res = await data.getText();

      // Wrapping in <p> tags so Tiptap recognizes it as structured HTML
      const htmlContent = res.text
        .split("\n\n")
        .map((para: string) => `<p>${para.trim()}</p>`)
        .join("");

      return {
        status: "success",
        message: "pdf parsed successfully",
        response: { title: fileName, content: htmlContent },
      };
    }

    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const options = {
        // This function runs for every image found in the doc
        //@ts-expect-error deliberately sending empty object for excluding images in docs
        convertImage: mammoth.images.imgElement(() => ({})),
      };

      // Mammoth converts .docx directly to clean HTML
      const result = await mammoth.convertToHtml({ buffer }, options);

      return {
        status: "success",
        message: "doc parsed successfully",
        response: { title: fileName, content: result.value },
      };
    }

    throw new Error("Unsupported file type. Please upload a PDF or DOCX");
  } catch (error) {
    console.error("FILE_PARSING_ERROR: ", error);
    return {
      status: "error",
      //@ts-expect-error {status:string,message:string}
      message: "File conversion failed:" + error?.message,
    };
  }
};
