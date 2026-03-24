const SemanticSearch = async (query: string, userId: string, limit = 10) => {
  //     const embeddingRes = await openai.embeddings.create({ ... });
  //     const vector = embeddingRes.data[0].embedding;
  //     const db = await getDb();
  //     const results = await db.collection("notes").aggregate([
  //         {
  //     $vectorSearch: {
  //       index: "vector_index",
  //       path: "embedding",
  //       queryVector: vector,
  //       numCandidates: 100,
  //       limit,
  //       filter: { userId } // tenant isolation
  //     }
  // },
  // { $project: { embedding: 0 } }
  // ]).toArray();
  // return results;
};
export default SemanticSearch;
