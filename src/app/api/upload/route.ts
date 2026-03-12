import { NextRequest, NextResponse } from "next/server";
import { saveFile, uniqueFilename } from "@/lib/storage";

// ============================================
// /api/upload — File upload endpoint for image and audio proof
// POST: Upload a file (multipart form data)
// Saves to public/uploads/ locally, returns the public URL
// In production, replace with S3/Firebase/Cloudinary upload
// ============================================

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "image" or "audio"
    const distributionId = formData.get("distributionId") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "File must be an image" },
        { status: 400 }
      );
    }
    if (type === "audio" && !file.type.startsWith("audio/")) {
      return NextResponse.json(
        { success: false, error: "File must be an audio file" },
        { status: 400 }
      );
    }

    // Limit file size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be under 10MB" },
        { status: 400 }
      );
    }

    // Convert File to Buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = uniqueFilename(file.name);
    const subfolder = type === "audio" ? "audio" : "images";
    const url = await saveFile(buffer, filename, subfolder);

    return NextResponse.json({
      success: true,
      url,
      filename,
      distributionId,
    });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
