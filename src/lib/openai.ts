import OpenAI from "openai";
import type { ChatMessage } from "./types";

// ============================================
// OpenAI integration for the donor chatbot
// Answers questions about donations, distribution status, and ration tracking
// ============================================

// Lazy-initialize the client so the app builds even without the API key
function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  });
}

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
 * Maintains conversation history for context.
 */
export async function chatWithDonor(
  messages: ChatMessage[],
  donorContext?: string
): Promise<string> {
  const systemMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // If we have donor-specific context (e.g. their donation history), inject it
  if (donorContext) {
    systemMessages.push({
      role: "system",
      content: `Donor context: ${donorContext}`,
    });
  }

  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini", // Cost-effective for chat — upgrade to gpt-4o if needed
    messages: [...systemMessages, ...messages],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content ?? "I'm sorry, I couldn't process that request.";
}
