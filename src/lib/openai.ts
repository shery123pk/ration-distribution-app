import type { ChatMessage } from "./types";

// ============================================
// OpenAI integration for the donor chatbot
// Uses direct fetch API for maximum compatibility with Vercel serverless
// ============================================

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/** System prompt that gives the chatbot context about Jaan Group */
const SYSTEM_PROMPT = `You are a helpful assistant for Jaan Group Transparent Charity System, a charitable organization based in Pakistan.
Jaan Group distributes ration packages (flour, rice, dal, ghee, oil, sugar, etc.) to deserving families across Pakistan and worldwide.

Donation types:
- Zakat & Fitra: For Muslim beneficiaries only (Islamic obligation)
- Sadaqah: Voluntary charity that serves ALL communities regardless of faith

Bank details for donations:
- Account Holder: SHARMEEN ASIF
- Bank: Meezan Bank, Hub River Road
- Account Number: 01610105512619
- IBAN: PK70MEZN0001610105512619
- Contact after transfer: +92 330 2541908

Main contact: +92 349 2223336

You help donors with:
- Understanding how their donations are used
- Tracking which beneficiaries received their ration
- Explaining the distribution process (items are delivered with photo and voice proof)
- Answering questions about Zakat, Fitra, and Sadaqah eligibility
- Providing bank details and donation information
- Clarifying that Sadaqah helps all communities, while Zakat/Fitra is for Muslims

Be warm, respectful, and concise. You may respond in English or Urdu/Roman Urdu based on the donor's language.
If you don't have specific data about a donor's distribution, suggest they check the tracking page or contact us at +92 330 2541908.`;

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
