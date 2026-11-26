import { cosineSimilarity } from "@/lib/utils";
import { NoteType } from "@/types/note";
import type { LinkObject, NodeObject } from "react-force-graph-3d";

// ---------- Types ----------

export type GraphNode = NodeObject & {
  id: string;
  name: string;
  type: "note" | "tag";
  val: number;
  tags?: string[];
};

export type GraphLink = LinkObject & {
  value: number;
  type: "tag" | "semantic";
};

export type GraphData = { nodes: GraphNode[]; links: GraphLink[] };

export type GraphStats = {
  notes: number;
  tags: number;
  links: number;
  tagLinks: number;
  semanticLinks: number;
  clusters: number;
};

// ---------- Builder ----------

const SIMILARITY_THRESHOLD = 0.75; // higher = stricter

export function buildHybridGraph(rawNotes: NoteType[]): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const tagMap = new Map<string, string>(); // normalized tag -> node id

  // Note nodes
  rawNotes.forEach((note) => {
    nodes.push({
      id: note._id.toString(),
      name: note.title,
      type: "note",
      val: 8,
      tags: note.tags || [],
    });
  });

  // Tag nodes + tag links
  rawNotes.forEach((note) => {
    const noteId = note._id.toString();

    // normalize + dedupe so "React" / "react" merge and no duplicate links
    const uniqueTags = new Set(
      (note.tags || [])
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean),
    );

    uniqueTags.forEach((tag) => {
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

  // Semantic links from embeddings
  for (let i = 0; i < rawNotes.length; i++) {
    for (let j = i + 1; j < rawNotes.length; j++) {
      const a = rawNotes[i];
      const b = rawNotes[j];
      if (!a.embedding || !b.embedding) continue;

      const similarity = cosineSimilarity(a.embedding, b.embedding);
      if (similarity >= SIMILARITY_THRESHOLD) {
        links.push({
          source: a._id.toString(),
          target: b._id.toString(),
          value: similarity,
          type: "semantic",
        });
      }
    }
  }

  return { nodes, links };
}

// ---------- Stats ----------

type LinkEnd = string | number | NodeObject;

// react-force-graph replaces source/target ids with node objects once the
// simulation starts, so handle both shapes.
const endId = (e: LinkEnd): string | number =>
  typeof e === "object" ? (e.id as string | number) : e;

export function computeGraphStats(
  nodes: GraphNode[],
  links: GraphLink[],
): GraphStats {
  let notes = 0;
  let tags = 0;
  for (const n of nodes) {
    if (n.type === "note") notes++;
    else if (n.type === "tag") tags++;
  }

  let tagLinks = 0;
  let semanticLinks = 0;
  for (const l of links) {
    if (l.type === "semantic") semanticLinks++;
    else if (l.type === "tag") tagLinks++;
  }

  // Clusters = connected components (union-find)
  const parent = new Map<string | number, string | number>();
  nodes.forEach((n) => parent.set(n.id, n.id));

  const find = (x: string | number): string | number => {
    while (parent.get(x) !== x) {
      const p = parent.get(x)!;
      parent.set(x, parent.get(p)!); // path compression
      x = parent.get(x)!;
    }
    return x;
  };

  for (const l of links) {
    const a = endId(l.source as LinkEnd);
    const b = endId(l.target as LinkEnd);
    if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b));
  }

  const clusters = new Set(nodes.map((n) => find(n.id))).size;

  return {
    notes,
    tags,
    links: links.length,
    tagLinks,
    semanticLinks,
    clusters,
  };
}