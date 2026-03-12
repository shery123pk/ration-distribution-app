import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { store } from "@/lib/store";
import { appendRow } from "@/lib/sheets";
import type { Donor } from "@/lib/types";

// ============================================
// /api/donors — CRUD for donor records
// GET: List all donors
// POST: Register a new donor
// ============================================

export async function GET() {
  const donors = store.getAllDonors();
  return NextResponse.json({ success: true, data: donors });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if donor already exists
    const existing = store.getDonorByEmail(email);
    if (existing) {
      return NextResponse.json({ success: true, data: existing });
    }

    const donor: Donor = {
      id: uuid(),
      name,
      email,
      phone: phone ?? "",
      city: city ?? "Karachi",
      createdAt: new Date().toISOString(),
    };

    store.saveDonor(donor);

    // Sync to Google Sheets (non-blocking — don't fail if sheets isn't configured)
    appendRow("Donors", [
      donor.id, donor.name, donor.email, donor.phone, donor.city, donor.createdAt,
    ]).catch((err) => console.warn("Sheets sync failed:", err.message));

    return NextResponse.json({ success: true, data: donor }, { status: 201 });
  } catch (err) {
    console.error("POST /api/donors error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
