import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { store } from "@/lib/store";
import { appendRow } from "@/lib/sheets";
import type { Donor, Donation } from "@/lib/types";

// ============================================
// /api/donations — Create and list donations
// GET: List all donations (optionally filter by donorId query param)
// POST: Create a new donation (also creates donor if needed)
// ============================================

export async function GET(req: NextRequest) {
  const donorId = req.nextUrl.searchParams.get("donorId");

  const donations = donorId
    ? store.getDonationsByDonor(donorId)
    : store.getAllDonations();

  return NextResponse.json({ success: true, data: donations });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      donorName,
      donorEmail,
      donorPhone,
      donationType,
      items,
      amount,
      message,
    } = body;

    if (!donorName || !donorEmail || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Donor name, email, and at least one item are required" },
        { status: 400 }
      );
    }

    // Ensure donor exists (create if first time)
    let donor = store.getDonorByEmail(donorEmail);
    if (!donor) {
      donor = {
        id: uuid(),
        name: donorName,
        email: donorEmail,
        phone: donorPhone ?? "",
        city: "Karachi",
        createdAt: new Date().toISOString(),
      } satisfies Donor;
      store.saveDonor(donor);

      appendRow("Donors", [
        donor.id, donor.name, donor.email, donor.phone, donor.city, donor.createdAt,
      ]).catch(() => {});
    }

    // Create donation record
    const donation: Donation = {
      id: uuid(),
      donorId: donor.id,
      type: donationType ?? "sadaqah",
      amount: amount ?? 0,
      items: items ?? [],
      message: message ?? "",
      createdAt: new Date().toISOString(),
    };

    store.saveDonation(donation);

    // Sync to Google Sheets
    appendRow("Donations", [
      donation.id,
      donation.donorId,
      donation.type,
      donation.amount,
      JSON.stringify(donation.items),
      donation.message ?? "",
      donation.createdAt,
    ]).catch((err) => console.warn("Sheets sync failed:", err.message));

    return NextResponse.json(
      { success: true, data: { donor, donation } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/donations error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
