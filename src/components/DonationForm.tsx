"use client";

import { useState } from "react";
import { Heart, Loader2, CheckCircle2 } from "lucide-react";
import RationSelector from "./RationSelector";
import type { DonationType, SelectedItem } from "@/lib/types";

// ============================================
// Donation form — combines donation type, ration selection, and donor info
// ============================================

const DONATION_TYPES: { value: DonationType; label: string; description: string }[] = [
  { value: "zakat", label: "Zakat", description: "Obligatory 2.5% charity on savings" },
  { value: "fitra", label: "Fitra", description: "Given before Eid prayer for purification" },
  { value: "sadaqah", label: "Sadaqah", description: "Voluntary charity for any amount" },
];

export default function DonationForm() {
  const [donationType, setDonationType] = useState<DonationType>("sadaqah");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleSelectionChange(items: SelectedItem[], total: number) {
    setSelectedItems(items);
    setTotalAmount(total);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setError("Please select at least one ration item.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName,
          donorEmail,
          donorPhone,
          donationType,
          items: selectedItems,
          amount: totalAmount,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit donation");

      setSuccess(true);
      // Reset form
      setSelectedItems([]);
      setTotalAmount(0);
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand-500" />
        <h2 className="mt-4 text-brand-800">JazakAllah Khair!</h2>
        <p className="mt-2 text-gray-600">
          Your donation has been recorded. You will receive updates as rations
          are distributed to deserving families.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-primary mt-6"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Donation Type */}
      <div className="card">
        <h3 className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-brand-600" />
          Donation Type
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {DONATION_TYPES.map((dt) => (
            <button
              key={dt.value}
              type="button"
              onClick={() => setDonationType(dt.value)}
              className={`rounded-lg border-2 p-4 text-left transition ${
                donationType === dt.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-brand-300"
              }`}
            >
              <span className="font-semibold">{dt.label}</span>
              <p className="mt-1 text-xs text-gray-500">{dt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ration Items */}
      <RationSelector onSelectionChange={handleSelectionChange} />

      {/* Donor Info */}
      <div className="card">
        <h3 className="mb-4">Your Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              className="input-field"
              placeholder="Ahmed Khan"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              required
              className="input-field"
              placeholder="ahmed@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              className="input-field"
              placeholder="+92-300-1234567"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
              placeholder="Dua request or special note"
            />
          </div>
        </div>
      </div>

      {/* Summary & Submit */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {selectedItems.length} item(s) selected
            </p>
            <p className="text-2xl font-bold text-brand-700">
              Rs. {totalAmount.toLocaleString()}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading || selectedItems.length === 0}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Donation"
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </form>
  );
}
