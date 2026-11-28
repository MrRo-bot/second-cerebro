import OpenAI from "openai";
import { ObjectId } from "mongodb";
import { Readability } from "@mozilla/readability";
import { YoutubeTranscript } from "youtube-transcript";
import getVideoId from "get-video-id";

import { getCollections } from "@/lib/collections";
import { escapeRegex, getPromptForTags, normalizeError } from "@/lib/utils";

import {
  ParseFileType,
  ParseTranscriptType,
  ParseWebPageType,
} from "@/types/ai";

import {
  DEFAULT_MATRYOSHKA_DIM,
  EMBEDDING_MODEL,
  GEMINI_API_KEY,
  GROQ_API_KEY,
  GROQ_CHAT_MODEL,
  MS_PER_DAY,
  PREFERRED_LANG,
} from "@/lib/constants";

// Groq Client
export const groqClient = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* ------------------------------------------------------------------ *
 *  Gemini embeddings (plain fetch: works the same locally and on Vercel)
 * ------------------------------------------------------------------ */

// RETRIEVAL_DOCUMENT -> when embedding notes (create / update / re-embed script)
// RETRIEVAL_QUERY    -> when embedding a search query
export type EmbeddingTaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT";

const GEMINI_EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;

// Keep worst case (attempts x timeout + backoff) comfortably under your
// Vercel function limit.
const EMBED_MAX_ATTEMPTS = 3;
const EMBED_TIMEOUT_MS = 6_000;
const EMBED_BACKOFF_MS = 400;

// Gemini scores for ALL notes sit in a narrow band whatever the query, so an absolute
// cutoff can't tell "fitness" from gibberish. What differs is how far the best hits
// stand above the pack (top - median).
const POOL_SIZE = 100; // notes scored per query; also the sample the stats come from
const NUM_CANDIDATES = 1000;
const MIN_OUTLIER_GAP = 0.03; // top - median must reach this to return semantic hits
const OUTLIER_KEEP_FRACTION = 0.6; // keep notes in the top 40% of that gap
const RECENCY_HALF_LIFE_DAYS = 30;

class EmbeddingHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "EmbeddingHttpError";
    this.status = status;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry on rate limits, server errors, network errors and timeouts.
// Other 4xx errors (bad key, bad request) won't fix themselves.
const isRetryable = (error: unknown) =>
  !(error instanceof EmbeddingHttpError) ||
  error.status === 429 ||
  error.status >= 500;

export const embeddingCreator = async (
  text: string,
  matryoshkaDim: number = DEFAULT_MATRYOSHKA_DIM,
  taskType: EmbeddingTaskType = "RETRIEVAL_QUERY",
): Promise<number[]> => {
  try {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");

    const input = text.trim();
    if (!input) throw new Error("Cannot embed empty text");

    let lastError: unknown;

    for (let attempt = 0; attempt < EMBED_MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(GEMINI_EMBED_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            content: { parts: [{ text: input }] },
            taskType,
            outputDimensionality: matryoshkaDim,
          }),
          signal: AbortSignal.timeout(EMBED_TIMEOUT_MS),
        });

        if (!res.ok) {
          throw new EmbeddingHttpError(
            res.status,
            `Gemini embedding API ${res.status}: ${await res.text()}`,
          );
        }

        const data = await res.json();
        let embedding: number[] | undefined = data?.embedding?.values;

        if (!Array.isArray(embedding) || embedding.length === 0) {
          throw new Error("Gemini returned no embedding values");
        }

        if (embedding.length !== matryoshkaDim) {
          throw new Error(
            `Expected ${matryoshkaDim} dimensions but got ${embedding.length}. ` +
              "Check DEFAULT_MATRYOSHKA_DIM and the Atlas vector_index numDimensions.",
          );
        }

        // Truncated Gemini vectors are not unit-length: L2 normalize
        // (needed for cosine similarity)
        const norm = Math.sqrt(
          embedding.reduce((sum, val) => sum + val * val, 0),
        );
        if (norm > 0) {
          embedding = embedding.map((val) => val / norm);
        }

        return embedding;
      } catch (error) {
        lastError = error;
        if (!isRetryable(error) || attempt === EMBED_MAX_ATTEMPTS - 1) break;
        await sleep(EMBED_BACKOFF_MS * 2 ** attempt);
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Gemini embedding failed: ", error);
    throw new Error("Failed to generate embedding. Please try again.", {
      cause: error,
    });
  }
};

/*
 * Plain keyword search, used when the embedding service is unavailable
 * (quota exhausted, network error, ...) so search degrades instead of breaking.
 */
const keywordFallbackSearch = async (
  query: string,
  userID?: ObjectId,
  limit = 10,
) => {
  const { notes } = await getCollections();
  const regex = new RegExp(escapeRegex(query), "i");

  return notes
    .find({
      ...(userID && { userId: userID }),
      $or: [
        { content: { $regex: regex } },
        { title: { $regex: regex } },
        { tags: { $elemMatch: { $regex: regex } } },
      ],
    })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();
};

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
  limit = 20,
  numCandidates = NUM_CANDIDATES,
) => {
  const q = query.trim();
  if (!q) return [];

  let queryVector: number[];

  try {
    queryVector = await embeddingCreator(
      q,
      DEFAULT_MATRYOSHKA_DIM,
      "RETRIEVAL_QUERY",
    );
  } catch (error) {
    console.error("Embedding unavailable, using keyword search: ", error);
    return keywordFallbackSearch(q, userID);
  }

  const { notes } = await getCollections();
  const pattern = escapeRegex(q);
  const poolSize = Math.max(POOL_SIZE, limit);

  const rows = await notes
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: Math.max(numCandidates, poolSize),
          limit: poolSize,
          ...(userID && { filter: { userId: { $eq: userID } } }),
        },
      },
      {
        $addFields: {
          vectorScore: { $meta: "vectorSearchScore" },
          // Binary exact-phrase match
          keywordScore: {
            $cond: [
              {
                $or: [
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$content", ""] },
                      regex: pattern,
                      options: "i",
                    },
                  },
                  {
                    $regexMatch: {
                      input: { $ifNull: ["$title", ""] },
                      regex: pattern,
                      options: "i",
                    },
                  },
                  {
                    $anyElementTrue: {
                      $map: {
                        input: { $ifNull: ["$tags", []] },
                        as: "tag",
                        in: {
                          $regexMatch: {
                            input: { $ifNull: ["$$tag", ""] },
                            regex: pattern,
                            options: "i",
                          },
                        },
                      },
                    },
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      { $project: { embedding: 0 } },
    ])
    .toArray();

  if (rows.length === 0) return [];

  // --- Relevance gate: does anything stand out from the pack? ---
  const sorted = rows.map((r) => r.vectorScore as number).sort((a, b) => a - b);
  const top = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];
  const spread = top - median;
  // Tiny corpus: median is meaningless, so don't gate.
  const hasSemanticSignal = rows.length < 5 || spread >= MIN_OUTLIER_GAP;
  const cutoff = median + spread * OUTLIER_KEEP_FRACTION;

  const kept = rows.filter(
    (r) =>
      r.keywordScore === 1 ||
      (hasSemanticSignal && (rows.length < 5 || r.vectorScore >= cutoff)),
  );

  // --- Rank: distance above the median, exact-phrase bonus, gentle recency ---
  const now = Date.now();
  const ranked = kept
    .map((r) => {
      const vNorm =
        spread > 0
          ? Math.min(1, Math.max(0, (r.vectorScore - median) / spread))
          : 0;
      const ageDays = Math.max(
        0,
        (now - new Date(r.updatedAt ?? now).getTime()) / MS_PER_DAY,
      );
      const recency = 0.5 ** (ageDays / RECENCY_HALF_LIFE_DAYS);

      r.finalScore = 0.7 * vNorm + 0.2 * r.keywordScore + 0.1 * recency;
      return r;
    })
    .sort((a, b) => b.finalScore - a.finalScore);

  // const SEARCH_DEBUG=1
  // for env development only
  // if (SEARCH_DEBUG === 1) {
  //   console.log(
  //     `[search] "${q}" pool=${rows.length} top=${top.toFixed(3)} ` +
  //       `median=${median.toFixed(3)} gap=${spread.toFixed(3)} ` +
  //       `signal=${hasSemanticSignal} kept=${kept.length}`,
  //   );
  //   console.table(
  //     ranked.slice(0, 15).map((r) => ({
  //       title: String(r.title).slice(0, 40),
  //       vector: Number(r.vectorScore).toFixed(3),
  //       keyword: r.keywordScore,
  //       final: Number(r.finalScore).toFixed(3),
  //     })),
  //   );
  // }

  return ranked.slice(0, limit);
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
export const parseWebPage = async (
  url: string,
  html: string,
): Promise<ParseWebPageType> => {
  try {
    const { JSDOM } = await import("jsdom");

    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.content)
      throw new Error("Failed to parse the website");

    // Purifying for Tiptap
    const { default: TurndownService } = await import("turndown");
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(article.content);

    // Extracting plain text for the LLM (semantic extraction)
    const llmReadyText = (
      await getSemanticTextFromWebpage(article.content)
    ).substring(0, 15_000);

    return {
      status: "success",
      message: "Web parsing successful",
      response: {
        type: "web",
        title: article.title,
        content: markdownContent,
        plainText: llmReadyText,
      },
    };
  } catch (error) {
    console.error("Web parsing failed: ", error);
    return {
      status: "error" as const,
      message: normalizeError(error).message || "Web parsing failed",
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
const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

export const parseLocalFile = async (file: File): Promise<ParseFileType> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const fileType = file.type;
    if (fileType === "application/pdf") {
      const { PDFParse } = await import("pdf-parse");
      const data = new PDFParse({ data: buffer });
      const res = await data.getText();

      // to release file from memory
      await data.destroy();

      // Wrapping in <p> tags so Tiptap recognizes it as structured HTML
      const htmlContent = res.text
        .split("\n\n")
        .map((para: string) => para.trim())
        .filter(Boolean)
        .map((para: string) => `<p>${escapeHtml(para)}</p>`)
        .join("");

      return {
        status: "success",
        message: "PDF parsed successfully",
        response: { type: "pdf", title: fileName, content: htmlContent },
      };
    }

    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const mammoth = await import("mammoth");
      const options = {
        // This function runs for every image found in the doc or docx
        //@ts-expect-error deliberately sending empty object for excluding images in docs
        convertImage: mammoth.images.imgElement(() => ({})),
      };

      // Mammoth converts .docx directly to clean HTML
      const result = await mammoth.convertToHtml({ buffer }, options);

      return {
        status: "success",
        message: "DOC parsed successfully",
        response: { type: "word", title: fileName, content: result.value },
      };
    }
    throw new Error("Unsupported file type. Please upload a PDF or DOCX");
  } catch (error) {
    console.error("File parsing failed: ", error);
    return {
      status: "error" as const,
      message: normalizeError(error).message || "File parsing failed",
    };
  }
};

/*
 * if URL is available IF FAIL send error IF SUCCESS goto next
 * getting ID from URL IF FAIL send error IF SUCCESS goto next
 * getting metadata from ID IF FAIL send error IF SUCCESS goto next
 * getting transcript using ID IF FAIL send error IF SUCCESS goto next
 */
export const parseTranscript = async (
  url: string,
): Promise<ParseTranscriptType> => {
  try {
    if (!url) {
      throw new Error("YouTube URL is required");
    }

    const videoIdResult = getVideoId(url);
    const videoId = videoIdResult?.id;

    if (!videoId) throw new Error("Couldn't find valid ID");

    const ytdl = await import("@distube/ytdl-core");

    const info = await ytdl.getBasicInfo(videoId);

    const videoDetails = info.videoDetails;

    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: PREFERRED_LANG || "en",
    });

    if (!transcript || transcript.length === 0) {
      throw new Error("No transcript available for this video");
    }

    const fullText = transcript
      .map((entry) => entry.text.trim())
      .join(" ")
      .replace(/\s+/g, " ");

    return {
      status: "success",
      message: "Transcript parsed successfully",
      response: {
        type: "youtube",
        title: `${videoDetails.title} | ${videoDetails.author.name}`,
        content: fullText,
      },
    };
  } catch (error) {
    console.error("Transcript parsing failed: ", error);
    return {
      status: "error" as const,
      message: normalizeError(error).message || "Transcript parsing failed",
    };
  }
};

/*
 * create raw response of tags from prompt IF FAILS send error IF SUCCESS goto next
 * sanitizing tags
 * updating sanitized and trimmed tags in database
 */

// Pure helper: no DB access, just returns suggested tags.
export const autoTagNote = async (title: string, content: string) => {
  const prompt = getPromptForTags(title, content.substring(0, 8_000));

  let rawContent = "";
  let tags: string[] = [];
  try {
    const groqResponse = await groqClient.chat.completions.create({
      model: GROQ_CHAT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4, // slighly higher is fine, the model is more consistent
      max_completion_tokens: 300,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
    });

    rawContent = groqResponse.choices[0]?.message?.content || "";

    if (!rawContent) throw new Error("Empty response from groq");

    const parsed = JSON.parse(rawContent);

    // Handles common cases: direct array OR { tags: [...] } OR { keywords: [...] }
    if (Array.isArray(parsed)) {
      tags = parsed;
    } else if (parsed && typeof parsed === "object") {
      // Trying common property names
      tags = parsed.tags || parsed.keywords || parsed.tag || [];
      if (!Array.isArray(tags)) tags = [];
    }
  } catch (parseError) {
    console.error("TAG_PARSING_ERROR: ", parseError);
    console.error("Failed content was: ", rawContent);
    tags = [];
  }

  // === Sanitize tags ===
  let validTags: string[] = [];

  if (Array.isArray(tags) && tags.length > 0) {
    validTags = tags
      .map((tag) => {
        if (typeof tag !== "string") return "";
        return tag
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s\-_]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      })
      .filter((tag) => tag.length >= 1 && tag.length <= 30);

    validTags = [...new Set(validTags)]; // removed duplicates
  }

  // Only using "untagged" if truly nothing useful
  if (validTags.length === 0) {
    validTags = ["untagged"];
  } else if (validTags.length > 5) {
    validTags = validTags.slice(0, 5);
  }

  return validTags;
};
