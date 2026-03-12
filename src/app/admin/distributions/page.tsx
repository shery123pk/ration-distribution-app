"use client";

import { useState, useEffect, useCallback } from "react";
import { Truck, Plus, RefreshCw, Loader2 } from "lucide-react";
import DistributionCard from "@/components/DistributionCard";
import ProofUploader from "@/components/ProofUploader";
import type { Distribution, Donation, Beneficiary } from "@/lib/types";

// ============================================
// Admin: Distribution management page
// Assign donations to beneficiaries, upload proof, manage status
// ============================================

export default function DistributionsPage() {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  // New distribution form state
  const [showForm, setShowForm] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Which distribution is being uploaded with proof
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [distRes, donRes, benRes] = await Promise.all([
        fetch("/api/distributions"),
        fetch("/api/donations"),
        fetch("/api/beneficiaries"),
      ]);
      const distData = await distRes.json();
      const donData = await donRes.json();
      const benData = await benRes.json();

      setDistributions(distData.data ?? []);
      setDonations(donData.data ?? []);
      setBeneficiaries(benData.data ?? []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function createDistribution(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDonation || !selectedBeneficiary) return;
    setCreating(true);

    try {
      const res = await fetch("/api/distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationId: selectedDonation,
          beneficiaryId: selectedBeneficiary,
          notes,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setSelectedDonation("");
        setSelectedBeneficiary("");
        setNotes("");
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create distribution:", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Truck className="h-8 w-8 text-brand-600" />
            Distributions
          </h1>
          <p className="mt-1 text-gray-600">
            Assign donations to beneficiaries and upload distribution proof.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="btn-secondary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Distribution
          </button>
        </div>
      </div>

      {/* Create distribution form */}
      {showForm && (
        <form onSubmit={createDistribution} className="card mb-8">
          <h3 className="mb-4">Assign Donation to Beneficiary</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Select Donation *
              </label>
              <select
                value={selectedDonation}
                onChange={(e) => setSelectedDonation(e.target.value)}
                required
                className="input-field"
              >
                <option value="">— Choose a donation —</option>
                {donations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.type.toUpperCase()} — Rs. {d.amount.toLocaleString()} (
                    {d.items.length} items)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Select Beneficiary *
              </label>
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                required
                className="input-field"
              >
                <option value="">— Choose a beneficiary —</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.address} (Family: {b.familySize})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                placeholder="Any special instructions..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="btn-primary mt-4"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Distribution"
            )}
          </button>
        </form>
      )}

      {/* Distribution list */}
      {loading ? (
        <p className="text-center text-gray-400">Loading distributions...</p>
      ) : distributions.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-400">
            No distributions yet. Create one by assigning a donation to a
            beneficiary.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {distributions.map((dist) => (
            <div key={dist.id}>
              <DistributionCard distribution={dist} />

              {/* Upload proof button */}
              {dist.status !== "verified" && (
                <div className="mt-2">
                  {uploadingFor === dist.id ? (
                    <ProofUploader
                      distributionId={dist.id}
                      onUploaded={() => {
                        setUploadingFor(null);
                        fetchData();
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setUploadingFor(dist.id)}
                      className="btn-secondary w-full text-sm"
                    >
                      Upload Proof
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
