//re-embedding script if embedding model is changed
//npx tsx --env-file=.env.local scripts/reembed.ts

import { embeddingCreator } from "@/lib/ai";
import { getCollections } from "@/lib/collections";
import { DEFAULT_MATRYOSHKA_DIM } from "@/lib/constants";

async function reembedNotes() {
  const { notes } = await getCollections();
  const cursor = notes.find({});
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for await (const note of cursor) {
    const title = note.title?.trim() ?? "";
    const content = note.content?.trim() ?? "";

    if (!title && !content) {
      skipped++;
      continue;
    }

    try {
      const text = `Title: ${note.title ?? ""}\nContent: ${note.content ?? ""}`;
      const embedding = await embeddingCreator(
        text,
        DEFAULT_MATRYOSHKA_DIM,
        "RETRIEVAL_DOCUMENT"
      );

      await notes.updateOne({ _id: note._id }, { $set: { embedding } });
      updated++;
      console.log(`Updated note ${note._id} (${updated} done)`);
    } catch (err) {
      failed++;
      console.error(`Failed note ${note._id}:`, err);
    }

    await new Promise((r) => setTimeout(r, 700));
  }

  console.log(`Finished. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
  process.exit(0);
}

reembedNotes();