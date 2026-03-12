import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { store } from "@/lib/store";
import { appendRow } from "@/lib/sheets";
import type { Distribution } from "@/lib/types";

// ============================================
// /api/distributions — Create and list distribution records
// GET: List all distributions (optionally filter by donationId)
// POST: Create a new distribution (admin assigns donation to beneficiary)
// ============================================

export async function GET(req: NextRequest) {
  const donationId = req.nextUrl.searchParams.get("donationId");

  const distributions = donationId
    ? store.getDistributionsByDonation(donationId)
    : store.getAllDistributions();

  return NextResponse.json({ success: true, data: distributions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donationId, beneficiaryId, items, notes } = body;

    if (!donationId || !beneficiaryId) {
      return NextResponse.json(
        { success: false, error: "Donation ID and beneficiary ID are required" },
        { status: 400 }
      );
    }

    // Verify donation and beneficiary exist
    const donation = store.getDonation(donationId);
    const beneficiary = store.getBeneficiary(beneficiaryId);

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation not found" },
        { status: 404 }
      );
    }
    if (!beneficiary) {
      return NextResponse.json(
        { success: false, error: "Beneficiary not found" },
        { status: 404 }
      );
    }

    const distribution: Distribution = {
      id: uuid(),
      donationId,
      beneficiaryId,
      beneficiaryName: beneficiary.name,
      items: items ?? donation.items,
      status: "pending",
      notes: notes ?? "",
      distributedAt: undefined,
      verifiedAt: undefined,
    };

    store.saveDistribution(distribution);

    // Sync to Google Sheets
    appendRow("Distributions", [
      distribution.id,
      distribution.donationId,
      distribution.beneficiaryId,
      distribution.beneficiaryName,
      JSON.stringify(distribution.items),
      distribution.status,
      "",
      "",
      "",
      distribution.notes ?? "",
    ]).catch((err) => console.warn("Sheets sync failed:", err.message));

    return NextResponse.json(
      { success: true, data: distribution },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/distributions error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
