"use client";

import { CheckCircle2, Clock, Truck, Image as ImageIcon, Volume2 } from "lucide-react";
import type { Distribution } from "@/lib/types";

// ============================================
// Distribution card — shows proof of ration delivery
// Displays image proof, voice dua, items delivered, and status
// ============================================

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "badge-gray", icon: Clock },
  in_progress: { label: "In Progress", color: "badge-yellow", icon: Truck },
  delivered: { label: "Delivered", color: "badge-blue", icon: Truck },
  verified: { label: "Verified", color: "badge-green", icon: CheckCircle2 },
};

interface Props {
  distribution: Distribution;
}

export default function DistributionCard({ distribution }: Props) {
  const status = STATUS_CONFIG[distribution.status];
  const StatusIcon = status.icon;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">
            {distribution.beneficiaryName}
          </h4>
          <p className="text-xs text-gray-500">
            ID: {distribution.id.slice(0, 8)}...
          </p>
        </div>
        <span className={status.color}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </span>
      </div>

      {/* Items delivered */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase text-gray-500">
          Items Delivered
        </p>
        <div className="flex flex-wrap gap-2">
          {distribution.items.map((item) => (
            <span
              key={item.itemId}
              className="rounded-md bg-brand-50 px-2 py-1 text-xs text-brand-700"
            >
              {item.name}: {item.quantity} {item.unit}
            </span>
          ))}
        </div>
      </div>

      {/* Proof section */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Image proof */}
        {distribution.imageProofUrl ? (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
              <ImageIcon className="h-3 w-3" /> Photo Proof
            </p>
            <img
              src={distribution.imageProofUrl}
              alt="Distribution proof"
              className="h-40 w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            <ImageIcon className="mr-2 h-5 w-5" />
            Photo pending
          </div>
        )}

        {/* Voice proof (dua) */}
        {distribution.voiceProofUrl ? (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
              <Volume2 className="h-3 w-3" /> Voice Dua
            </p>
            <audio
              controls
              src={distribution.voiceProofUrl}
              className="w-full"
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
            <Volume2 className="mr-2 h-5 w-5" />
            Voice dua pending
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="mt-4 flex gap-4 text-xs text-gray-400">
        {distribution.distributedAt && (
          <span>Distributed: {new Date(distribution.distributedAt).toLocaleDateString()}</span>
        )}
        {distribution.verifiedAt && (
          <span>Verified: {new Date(distribution.verifiedAt).toLocaleDateString()}</span>
        )}
      </div>

      {distribution.notes && (
        <p className="mt-2 text-sm italic text-gray-500">
          &ldquo;{distribution.notes}&rdquo;
        </p>
      )}
    </div>
  );
}
