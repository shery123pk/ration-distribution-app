"use client";

import { useState, useRef } from "react";
import { Camera, Mic, Upload, Loader2, CheckCircle2 } from "lucide-react";

// ============================================
// Proof uploader — used by admins to upload image and voice proof
// for a distribution record
// ============================================

interface Props {
  distributionId: string;
  onUploaded?: (imageUrl?: string, voiceUrl?: string) => void;
}

export default function ProofUploader({ distributionId, onUploaded }: Props) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleVoiceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setVoiceFile(file);
  }

  async function uploadFile(file: File, type: "image" | "audio"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("distributionId", distributionId);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Failed to upload ${type}`);
    const data = await res.json();
    return data.url;
  }

  async function handleUpload() {
    if (!imageFile && !voiceFile) {
      setError("Please select at least one file to upload.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      let imageUrl: string | undefined;
      let voiceUrl: string | undefined;

      if (imageFile) {
        imageUrl = await uploadFile(imageFile, "image");
      }
      if (voiceFile) {
        voiceUrl = await uploadFile(voiceFile, "audio");
      }

      // Update the distribution record with proof URLs
      await fetch(`/api/distributions/${distributionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageProofUrl: imageUrl,
          voiceProofUrl: voiceUrl,
          status: "verified",
        }),
      });

      setDone(true);
      onUploaded?.(imageUrl, voiceUrl);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div className="card text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-500" />
        <p className="mt-2 text-sm text-gray-600">Proof uploaded successfully!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h4 className="mb-4 font-semibold">Upload Distribution Proof</h4>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Image upload */}
        <div>
          <button
            type="button"
            onClick={() => imageRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-brand-400"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-full rounded object-cover"
              />
            ) : (
              <>
                <Camera className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Photo of ration handover
                </span>
              </>
            )}
          </button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageFile && (
            <p className="mt-1 text-xs text-gray-500">{imageFile.name}</p>
          )}
        </div>

        {/* Voice upload */}
        <div>
          <button
            type="button"
            onClick={() => voiceRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-brand-400"
          >
            <Mic className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">
              Voice dua from beneficiary
            </span>
          </button>
          <input
            ref={voiceRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleVoiceChange}
          />
          {voiceFile && (
            <p className="mt-1 text-xs text-gray-500">{voiceFile.name}</p>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading || (!imageFile && !voiceFile)}
        className="btn-primary mt-4"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Proof
          </>
        )}
      </button>
    </div>
  );
}
