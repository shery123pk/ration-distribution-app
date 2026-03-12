import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";

// ============================================
// /api/distributions/[id] — Update a specific distribution
// PATCH: Update status, add proof URLs, etc.
// GET: Get a single distribution by ID
// ============================================

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const distribution = store.getDistribution(params.id);

  if (!distribution) {
    return NextResponse.json(
      { success: false, error: "Distribution not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: distribution });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const distribution = store.getDistribution(params.id);

    if (!distribution) {
      return NextResponse.json(
        { success: false, error: "Distribution not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status, imageProofUrl, voiceProofUrl, notes } = body;

    // Apply updates
    if (status) distribution.status = status;
    if (imageProofUrl) distribution.imageProofUrl = imageProofUrl;
    if (voiceProofUrl) distribution.voiceProofUrl = voiceProofUrl;
    if (notes !== undefined) distribution.notes = notes;

    // Set timestamps based on status changes
    if (status === "delivered" && !distribution.distributedAt) {
      distribution.distributedAt = new Date().toISOString();
    }
    if (status === "verified" && !distribution.verifiedAt) {
      distribution.verifiedAt = new Date().toISOString();
    }

    store.saveDistribution(distribution);

    return NextResponse.json({ success: true, data: distribution });
  } catch (err) {
    console.error("PATCH /api/distributions/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
