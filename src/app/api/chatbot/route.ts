import { NextRequest, NextResponse } from "next/server";
import { chatWithDonor } from "@/lib/openai";
import type { ChatMessage } from "@/lib/types";

// ============================================
// /api/chatbot — OpenAI-powered chat endpoint
// POST: Send messages and get AI response
// The chatbot answers donor queries about their donations,
// distribution status, and general questions about Jaan Group
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, donorContext } = body as {
      messages: ChatMessage[];
      donorContext?: string;
    };

    if (!messages?.length) {
      return NextResponse.json(
        { success: false, error: "Messages are required" },
        { status: 400 }
      );
    }

    // Check if OpenAI key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: true,
        reply:
          "The chatbot is not configured yet. Please set your OPENAI_API_KEY in .env.local to enable AI responses. For now, please contact us at info@jaangroup.org for assistance.",
      });
    }

    const reply = await chatWithDonor(messages, donorContext);

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("POST /api/chatbot error:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        reply: "Sorry, I'm having trouble right now. Please try again later.",
        debug: errorMessage,
      },
      { status: 500 }
    );
  }
}
