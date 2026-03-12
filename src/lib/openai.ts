import type { ChatMessage } from "./types";

// ============================================
// OpenAI integration for the donor chatbot
// Uses direct fetch API for maximum compatibility with Vercel serverless
// ============================================

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/** System prompt that gives the chatbot context about Jaan Group */
const SYSTEM_PROMPT = `You are a helpful assistant for Jaan Group, a charity organization based in Karachi, Pakistan.
Jaan Group distributes ration packages (flour, rice, dal, ghee, oil, sugar, etc.) to deserving families.
Donors contribute through Zakat, Fitra, or Sadaqah.

You help donors with:
- Understanding how their donations are used
- Tracking which beneficiaries received their ration
- Explaining the distribution process (items are delivered with photo and voice proof)
- Answering questions about Zakat, Fitra, and Sadaqah eligibility
- Providing information about ration packages and pricing

Be warm, respectful, and concise. You may respond in English or Urdu/Roman Urdu based on the donor's language.
If you don't have specific data about a donor's distribution, suggest they check the tracking page or contact admin.`;

/**
 * Send a chat message to OpenAI and get a response.
 * Uses direct fetch for Vercel serverless compatibility.
 */
export async function chatWithDonor(
  messages: ChatMessage[],
  donorContext?: string
): Promise<string> {
  const systemMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (donorContext) {
    systemMessages.push({
      role: "system",
      content: `Donor context: ${donorContext}`,
    });
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [...systemMessages, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't process that request.";
}
