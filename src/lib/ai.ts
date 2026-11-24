import { InferenceClient } from "@huggingface/inference";
//TODO: might need huggingface/transformers instead of this

import OpenAI from "openai";
import { ObjectId } from "mongodb";
import { Readability } from "@mozilla/readability";
import { YoutubeTranscript } from "youtube-transcript";
import getVideoId from "get-video-id";

import { notes } from "@/lib/collections";
import { escapeRegex, getPromptForTags, normalizeError } from "@/lib/utils";

import {
  ParseFileType,
  ParseTranscriptType,
  ParseWebPageType,
} from "@/types/ai";

import {
  DEFAULT_MATRYOSHKA_DIM,
  GROQ_API_KEY,
  GROQ_CHAT_MODEL,
  MODEL_NAME,
  MS_PER_DAY,
  HUGGINGFACE_TRANSFORMER_TOKEN,
  PREFERRED_LANG,
} from "@/lib/constants";

// @huggingface/transformer Client
const hf = new InferenceClient(HUGGINGFACE_TRANSFORMER_TOKEN);

// Groq Client
export const groqClient = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const embeddingCreator = async (
  text: string,
  matryoshkaDim: number = DEFAULT_MATRYOSHKA_DIM,
): Promise<number[]> => {
  try {
    // Call Hugging Face feature-extraction endpoint
    const result = await hf.featureExtraction({
      model: MODEL_NAME,
      inputs: text,
    });

    // The result is usually a nested array → flatten it
    let embedding: number[] = Array.isArray(result[0])
      ? (result as number[][])[0]
      : (result as number[]);

    // Apply Matryoshka truncation (take first N dimensions)
    if (embedding.length > matryoshkaDim) {
      embedding = embedding.slice(0, matryoshkaDim);
    }

    // Optional: L2 normalize (recommended for cosine similarity)
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      embedding = embedding.map((val) => val / norm);
    }

    return embedding;
  } catch (error) {
    console.error("HuggingFace embedding failed: ", error);
    throw new Error("Failed to generate embedding. Please try again.", {
      cause: error,
    });
  }
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
  limit = 50,
  numCandidates = 200,
) => {
  const queryVector = await embeddingCreator(query);

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
                  regex: escapeRegex(query),
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

    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.content)
      throw new Error("Failed to parse the website");

    // Purifying for Tiptap
    const { default: TurndownService } = await import("turndown");
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(article.content);

    // Extracting Plain Text for LLM (semantic extraction)
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
export const parseLocalFile = async (file: File): Promise<ParseFileType> => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const fileType = file.type;
    if (fileType === "application/pdf") {
      const { PDFParse } = await import("pdf-parse");
      const data = new PDFParse({ data: buffer });
      const res = await data.getText();

      // Wrapping in <p> tags so Tiptap recognizes it as structured HTML
      const htmlContent = res.text
        .split("\n\n")
        .map((para: string) => `<p>${para.trim()}</p>`)
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
        // This function runs for every image found in the doc
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
export const autoTagNote = async (
  noteId: string,
  title: string,
  content: string,
) => {
  const safeObjectId = (id: string) =>
    ObjectId.isValid(id) ? new ObjectId(id) : undefined;

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

  const oid = safeObjectId(noteId);
  if (!oid) {
    console.error("Invalid note id: ", noteId);
    return validTags;
  }

  await notes.updateOne(
    { _id: oid },
    { $set: { tags: validTags, updatedAt: new Date() } },
  );

  return validTags;
};
