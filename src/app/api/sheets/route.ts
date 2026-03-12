import { NextRequest, NextResponse } from "next/server";
import { readSheet, initSheetHeaders } from "@/lib/sheets";

// ============================================
// /api/sheets — Google Sheets integration endpoints
// GET: Read data from a sheet tab (query param: tab=Donors|Donations|etc.)
// POST: Initialize sheet headers (call once during setup)
// ============================================

export async function GET(req: NextRequest) {
  try {
    const tab = req.nextUrl.searchParams.get("tab") ?? "Donors";
    const allowedTabs = ["Donors", "Donations", "Beneficiaries", "Distributions"];

    if (!allowedTabs.includes(tab)) {
      return NextResponse.json(
        { success: false, error: `Invalid tab. Use one of: ${allowedTabs.join(", ")}` },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Google Sheets not configured. Set GOOGLE_SHEET_ID in .env.local",
      });
    }

    const rows = await readSheet(tab);
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/sheets error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to read sheet" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    if (!process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json({
        success: false,
        error: "Google Sheets not configured. Set GOOGLE_SHEET_ID in .env.local",
      });
    }

    await initSheetHeaders();
    return NextResponse.json({
      success: true,
      message: "Sheet headers initialized successfully",
    });
  } catch (err) {
    console.error("POST /api/sheets error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to initialize sheets" },
      { status: 500 }
    );
  }
}
