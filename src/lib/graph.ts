import { cosineSimilarity } from "@/lib/utils";
import { NoteType } from "@/types/note";
import type { LinkObject, NodeObject } from "react-force-graph-3d";

export function buildHybridGraph(rawNotes: NoteType[]) {
  const nodes: NodeObject[] = [];
  const links: LinkObject[] = [];
  const tagMap = new Map<string, string>();

  // Creating Note Nodes
  rawNotes.forEach((note) => {
    const noteId = note._id.toString();
    nodes.push({
      id: noteId,
      name: note.title,
      type: "note",
      val: 8,
      tags: note.tags || [],
    });
  });

  // Creating Tag Nodes + Tag-based Links
  rawNotes.forEach((note) => {
    const noteId = note._id.toString();
    (note.tags || []).forEach((tag: string) => {
      let tagId = tagMap.get(tag);
      if (!tagId) {
        tagId = `tag-${tag}`;
        tagMap.set(tag, tagId);
        nodes.push({
          id: tagId,
          name: `#${tag}`,
          type: "tag",
          val: 4,
        });
      }
      links.push({
        source: noteId,
        target: tagId,
        value: 1.0,
        type: "tag",
      });
    });
  });

  // Adding Semantic Links using Embeddings (optional threshold)
  const SIMILARITY_THRESHOLD = 0.75; // (higher = stricter)

  for (let i = 0; i < rawNotes.length; i++) {
    for (let j = i + 1; j < rawNotes.length; j++) {
      const noteA = rawNotes[i];
      const noteB = rawNotes[j];

      if (!noteA.embedding || !noteB.embedding) continue;

      const similarity = cosineSimilarity(noteA.embedding, noteB.embedding);

      if (similarity >= SIMILARITY_THRESHOLD) {
        links.push({
          source: noteA._id.toString(),
          target: noteB._id.toString(),
          value: similarity,
          type: "semantic",
        });
      }
    }
  }

  return { nodes, links };
}
