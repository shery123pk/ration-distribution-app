import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { store } from "@/lib/store";
import { appendRow } from "@/lib/sheets";
import type { Beneficiary } from "@/lib/types";

// ============================================
// /api/beneficiaries — CRUD for beneficiary records
// GET: List all beneficiaries
// POST: Add a new beneficiary (admin action)
// ============================================

export async function GET() {
  const beneficiaries = store.getAllBeneficiaries();
  return NextResponse.json({ success: true, data: beneficiaries });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, cnic, phone, address, familySize } = body;

    if (!name || !cnic || !address) {
      return NextResponse.json(
        { success: false, error: "Name, CNIC, and address are required" },
        { status: 400 }
      );
    }

    const beneficiary: Beneficiary = {
      id: uuid(),
      name,
      cnic,
      phone: phone ?? "",
      address,
      familySize: familySize ?? 1,
      verified: false,
      addedBy: "admin", // In production, get from auth session
      createdAt: new Date().toISOString(),
    };

    store.saveBeneficiary(beneficiary);

    // Sync to Google Sheets
    appendRow("Beneficiaries", [
      beneficiary.id,
      beneficiary.name,
      beneficiary.cnic,
      beneficiary.phone,
      beneficiary.address,
      beneficiary.familySize,
      beneficiary.verified,
      beneficiary.addedBy,
      beneficiary.createdAt,
    ]).catch((err) => console.warn("Sheets sync failed:", err.message));

    return NextResponse.json(
      { success: true, data: beneficiary },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/beneficiaries error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
