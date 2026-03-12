import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ============================================
// File storage utility
// Local development: saves to public/uploads/
// Production: replace with S3, Firebase Storage, or Cloudinary
// ============================================

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Save an uploaded file to local storage.
 * Returns the public URL path for the file.
 *
 * @param buffer - File data as a Buffer
 * @param filename - Desired filename (should include extension)
 * @param subfolder - Optional subfolder (e.g. "images", "audio")
 */
export async function saveFile(
  buffer: Buffer,
  filename: string,
  subfolder: string = ""
): Promise<string> {
  const dir = subfolder ? path.join(UPLOAD_DIR, subfolder) : UPLOAD_DIR;

  // Ensure directory exists
  await mkdir(dir, { recursive: true });

  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  // Return the public-accessible URL path
  const urlPath = subfolder
    ? `/uploads/${subfolder}/${filename}`
    : `/uploads/${filename}`;

  return urlPath;
}

/**
 * Generate a unique filename with timestamp to avoid collisions.
 */
export function uniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, "_");
  const timestamp = Date.now();
  return `${base}_${timestamp}${ext}`;
}
