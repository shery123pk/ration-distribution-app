"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import BeneficiaryForm from "@/components/BeneficiaryForm";
import type { Beneficiary } from "@/lib/types";

// ============================================
// Admin: Beneficiary management page
// Add new beneficiaries, view list, toggle verification
// ============================================

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/beneficiaries");
      const data = await res.json();
      setBeneficiaries(data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch beneficiaries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Users className="h-8 w-8 text-brand-600" />
            Beneficiaries
          </h1>
          <p className="mt-1 text-gray-600">
            Add and manage deserving families for ration distribution.
          </p>
        </div>
        <button onClick={fetchBeneficiaries} className="btn-secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Add form */}
      <div className="mb-8">
        <BeneficiaryForm onSuccess={fetchBeneficiaries} />
      </div>

      {/* Beneficiary list */}
      <div className="card">
        <h3 className="mb-4">
          All Beneficiaries ({beneficiaries.length})
        </h3>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : beneficiaries.length === 0 ? (
          <p className="text-center text-gray-400">
            No beneficiaries added yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-gray-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">CNIC</th>
                  <th className="pb-3 pr-4">Phone</th>
                  <th className="pb-3 pr-4">Address</th>
                  <th className="pb-3 pr-4">Family</th>
                  <th className="pb-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">{b.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{b.cnic}</td>
                    <td className="py-3 pr-4 text-gray-600">{b.phone || "—"}</td>
                    <td className="py-3 pr-4 text-gray-600 max-w-[200px] truncate">
                      {b.address}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {b.familySize}
                    </td>
                    <td className="py-3">
                      {b.verified ? (
                        <span className="badge-green">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="badge-yellow">
                          <XCircle className="mr-1 h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
