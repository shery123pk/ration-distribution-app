"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

// ============================================
// Form for admins to add or edit a beneficiary
// ============================================

interface Props {
  onSuccess?: () => void;
}

export default function BeneficiaryForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [familySize, setFamilySize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cnic, phone, address, familySize }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to add beneficiary");
      }

      // Reset form
      setName("");
      setCnic("");
      setPhone("");
      setAddress("");
      setFamilySize(1);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-brand-600" />
        Add Beneficiary
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Fatima Bibi"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            CNIC *
          </label>
          <input
            type="text"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            required
            pattern="\d{5}-\d{7}-\d{1}"
            className="input-field"
            placeholder="42201-1234567-8"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder="+92-300-1234567"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Family Size *
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={familySize}
            onChange={(e) => setFamilySize(Number(e.target.value))}
            required
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="input-field"
            placeholder="House #, Street, Area, Karachi"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Beneficiary"
        )}
      </button>
    </form>
  );
}
