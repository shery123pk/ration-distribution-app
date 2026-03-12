"use client";

import { useState } from "react";
import { Search, Loader2, PackageSearch } from "lucide-react";
import DistributionCard from "@/components/DistributionCard";
import type { Distribution, Donation } from "@/lib/types";

// ============================================
// Distribution tracking page
// Donors can search by email to see how their donations were distributed
// Shows image proof, voice dua, items delivered, and status
// ============================================

export default function TrackPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setSearched(false);

    try {
      // Step 1: Find the donor by looking at all donors
      const donorsRes = await fetch("/api/donors");
      const donorsData = await donorsRes.json();
      const donor = donorsData.data?.find(
        (d: { email: string }) => d.email.toLowerCase() === email.toLowerCase()
      );

      if (!donor) {
        setDonations([]);
        setDistributions([]);
        setSearched(true);
        return;
      }

      // Step 2: Get donations for this donor
      const donationsRes = await fetch(`/api/donations?donorId=${donor.id}`);
      const donationsData = await donationsRes.json();
      setDonations(donationsData.data ?? []);

      // Step 3: Get distributions for each donation
      const allDistributions: Distribution[] = [];
      for (const donation of donationsData.data ?? []) {
        const distRes = await fetch(`/api/distributions?donationId=${donation.id}`);
        const distData = await distRes.json();
        allDistributions.push(...(distData.data ?? []));
      }
      setDistributions(allDistributions);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Track Your Donations
        </h1>
        <p className="mt-2 text-gray-600">
          Enter your email to see how your donations have been distributed to
          deserving families.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="card mb-8">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your donor email..."
            required
            className="input-field flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {searched && donations.length === 0 && (
        <div className="card text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">
            No donations found for this email. If you recently donated, please
            allow some time for processing.
          </p>
        </div>
      )}

      {donations.length > 0 && (
        <div className="space-y-6">
          {/* Donation summary */}
          <div className="card">
            <h2 className="text-xl font-semibold">Your Donations</h2>
            <div className="mt-4 space-y-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                >
                  <div>
                    <span className="badge-green capitalize">
                      {donation.type}
                    </span>
                    <span className="ml-3 text-sm text-gray-600">
                      {donation.items.length} items
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-700">
                      Rs. {donation.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution details with proof */}
          {distributions.length > 0 ? (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Distribution Details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {distributions.map((dist) => (
                  <DistributionCard key={dist.id} distribution={dist} />
                ))}
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <p className="text-gray-500">
                Your donations are being processed. Distribution details will
                appear here once rations are delivered.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
