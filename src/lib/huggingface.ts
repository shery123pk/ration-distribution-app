import { HfInference } from "@huggingface/inference";

// ============================================
// Hugging Face Inference API integration
// Used to generate text embeddings for Qdrant vector search
// Free tier supports many models with rate limits
// ============================================

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Generate a 384-dimension embedding vector from text.
 * Uses sentence-transformers/all-MiniLM-L6-v2 — lightweight and effective.
 * These embeddings are stored in Qdrant for beneficiary similarity search.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // The API returns nested arrays for single inputs — flatten to 1D
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0] as number[];
  }
  return result as number[];
}

/**
 * Classify text intent using zero-shot classification.
 * Useful for routing chatbot queries.
 * Example: "where is my donation?" -> "donation tracking"
 */
export async function classifyIntent(text: string): Promise<string> {
  const candidateLabels = [
    "donation tracking",
    "ration inquiry",
    "beneficiary info",
    "general question",
    "complaint",
  ];

  // Use the raw request endpoint for zero-shot classification
  // since textClassification doesn't support candidate_labels
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: { candidate_labels: candidateLabels },
      }),
    }
  );

  if (!response.ok) return "general question";

  const result = await response.json();
  return result.labels?.[0] ?? "general question";
}

export { hf };
