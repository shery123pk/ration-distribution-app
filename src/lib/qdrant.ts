import { QdrantClient } from "@qdrant/js-client-rest";

// ============================================
// Qdrant vector database integration
// Used for semantic search over beneficiaries and donor messages
// Free tier: https://cloud.qdrant.io (1GB free cluster)
// ============================================

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL ?? "http://localhost:6333",
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION = process.env.QDRANT_COLLECTION ?? "beneficiaries";

/**
 * Ensure the beneficiaries collection exists.
 * Call this once during setup or on first API request.
 */
export async function ensureCollection(): Promise<void> {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some((c) => c.name === COLLECTION);

  if (!exists) {
    await qdrant.createCollection(COLLECTION, {
      vectors: {
        size: 384, // Matches sentence-transformers/all-MiniLM-L6-v2 output dimension
        distance: "Cosine",
      },
    });
    console.log(`Created Qdrant collection: ${COLLECTION}`);
  }
}

/**
 * Upsert a beneficiary record with its embedding vector.
 * The payload stores searchable metadata (name, address, CNIC, etc.)
 */
export async function upsertBeneficiary(
  id: string,
  vector: number[],
  payload: Record<string, unknown>
): Promise<void> {
  await qdrant.upsert(COLLECTION, {
    wait: true,
    points: [
      {
        id,
        vector,
        payload,
      },
    ],
  });
}

/**
 * Search beneficiaries by semantic similarity.
 * Useful for finding beneficiaries by description, address, or need.
 */
export async function searchBeneficiaries(
  queryVector: number[],
  limit: number = 5
) {
  const results = await qdrant.search(COLLECTION, {
    vector: queryVector,
    limit,
    with_payload: true,
  });

  return results;
}

/**
 * Retrieve a specific beneficiary by ID.
 */
export async function getBeneficiaryById(id: string) {
  const result = await qdrant.retrieve(COLLECTION, {
    ids: [id],
    with_payload: true,
    with_vector: false,
  });
  return result[0] ?? null;
}

export { qdrant };
