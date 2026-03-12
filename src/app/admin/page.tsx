"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  Truck,
  Heart,
  RefreshCw,
  Loader2,
} from "lucide-react";

// ============================================
// Admin dashboard — Overview of all data
// Links to beneficiary management and distribution management
// ============================================

interface Stats {
  donors: number;
  donations: number;
  beneficiaries: number;
  distributions: number;
  totalAmount: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    setLoading(true);
    try {
      const [donorsRes, donationsRes, beneficiariesRes, distributionsRes] =
        await Promise.all([
          fetch("/api/donors"),
          fetch("/api/donations"),
          fetch("/api/beneficiaries"),
          fetch("/api/distributions"),
        ]);

      const donors = await donorsRes.json();
      const donations = await donationsRes.json();
      const beneficiaries = await beneficiariesRes.json();
      const distributions = await distributionsRes.json();

      const totalAmount = (donations.data ?? []).reduce(
        (sum: number, d: { amount: number }) => sum + d.amount,
        0
      );

      setStats({
        donors: donors.data?.length ?? 0,
        donations: donations.data?.length ?? 0,
        beneficiaries: beneficiaries.data?.length ?? 0,
        distributions: distributions.data?.length ?? 0,
        totalAmount,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const STAT_CARDS = [
    {
      label: "Total Donors",
      value: stats?.donors ?? 0,
      icon: Heart,
      color: "text-pink-600 bg-pink-100",
    },
    {
      label: "Donations",
      value: stats?.donations ?? 0,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Beneficiaries",
      value: stats?.beneficiaries ?? 0,
      icon: Users,
      color: "text-brand-600 bg-brand-100",
    },
    {
      label: "Distributions",
      value: stats?.distributions ?? 0,
      icon: Truck,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Manage beneficiaries, track distributions, and monitor donations.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="btn-secondary"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total amount */}
      {stats && (
        <div className="card mb-8 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
          <p className="text-sm font-medium text-brand-100">
            Total Donations Received
          </p>
          <p className="text-3xl font-bold">
            Rs. {stats.totalAmount.toLocaleString()}
          </p>
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/beneficiaries"
          className="card transition hover:border-brand-400 hover:shadow-md"
        >
          <Users className="h-8 w-8 text-brand-600" />
          <h3 className="mt-3 text-lg font-semibold">
            Manage Beneficiaries
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add, verify, and search beneficiary families
          </p>
        </Link>
        <Link
          href="/admin/distributions"
          className="card transition hover:border-brand-400 hover:shadow-md"
        >
          <Truck className="h-8 w-8 text-brand-600" />
          <h3 className="mt-3 text-lg font-semibold">
            Manage Distributions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Assign donations to beneficiaries, upload proof
          </p>
        </Link>
      </div>
    </div>
  );
}
