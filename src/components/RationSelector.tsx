"use client";

import { useState } from "react";
import { Package, Plus, Minus, ShoppingCart } from "lucide-react";
import { RATION_ITEMS, RATION_PACKAGES } from "@/data/ration-items";
import type { SelectedItem } from "@/lib/types";

// ============================================
// Ration item selector component
// Allows donors to pick individual items or a pre-built package
// ============================================

interface Props {
  onSelectionChange: (items: SelectedItem[], total: number) => void;
}

export default function RationSelector({ onSelectionChange }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"items" | "packages">("packages");

  // Update quantity for a specific item
  function setQty(itemId: string, qty: number) {
    const updated = { ...quantities, [itemId]: Math.max(0, qty) };
    if (updated[itemId] === 0) delete updated[itemId];
    setQuantities(updated);
    emitChange(updated);
  }

  // Apply a pre-built package
  function applyPackage(pkgItems: { itemId: string; quantity: number }[]) {
    const updated: Record<string, number> = {};
    pkgItems.forEach(({ itemId, quantity }) => {
      updated[itemId] = quantity;
    });
    setQuantities(updated);
    emitChange(updated);
  }

  // Calculate selected items and total, then notify parent
  function emitChange(qtys: Record<string, number>) {
    const selected: SelectedItem[] = [];
    let total = 0;

    Object.entries(qtys).forEach(([itemId, quantity]) => {
      const item = RATION_ITEMS.find((r) => r.id === itemId);
      if (item && quantity > 0) {
        const totalPrice = item.pricePerUnit * quantity;
        total += totalPrice;
        selected.push({
          itemId: item.id,
          name: item.name,
          quantity,
          unit: item.unit,
          totalPrice,
        });
      }
    });

    onSelectionChange(selected, total);
  }

  const totalAmount = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = RATION_ITEMS.find((r) => r.id === id);
    return sum + (item ? item.pricePerUnit * qty : 0);
  }, 0);

  const itemCount = Object.values(quantities).reduce((s, q) => s + q, 0);

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-brand-600" />
          Select Ration Items
        </h3>
        {itemCount > 0 && (
          <span className="badge-green">
            {itemCount} items — Rs. {totalAmount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Tabs: packages vs individual items */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab("packages")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "packages"
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Package className="mr-1 inline h-4 w-4" />
          Packages
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "items"
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Custom Items
        </button>
      </div>

      {/* Package selection */}
      {activeTab === "packages" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RATION_PACKAGES.map((pkg) => {
            const pkgTotal = pkg.items.reduce((sum, pi) => {
              const item = RATION_ITEMS.find((r) => r.id === pi.itemId);
              return sum + (item ? item.pricePerUnit * pi.quantity : 0);
            }, 0);

            return (
              <button
                key={pkg.id}
                onClick={() => applyPackage(pkg.items)}
                className="rounded-lg border border-gray-200 p-4 text-left transition hover:border-brand-400 hover:shadow-md"
              >
                <h4 className="font-semibold text-brand-700">{pkg.name}</h4>
                <p className="mt-1 text-xs text-gray-500">{pkg.description}</p>
                <p className="mt-2 text-sm font-bold text-brand-600">
                  Rs. {pkgTotal.toLocaleString()}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Individual item selection */}
      {activeTab === "items" && (
        <div className="space-y-2">
          {RATION_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
            >
              <div className="flex-1">
                <span className="font-medium">{item.name}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {item.nameUrdu}
                </span>
                <div className="text-xs text-gray-500">
                  Rs. {item.pricePerUnit}/{item.unit}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(item.id, (quantities[item.id] ?? 0) - 1)}
                  className="rounded-md bg-gray-100 p-1 hover:bg-gray-200"
                  aria-label={`Decrease ${item.name}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {quantities[item.id] ?? 0}
                </span>
                <button
                  onClick={() => setQty(item.id, (quantities[item.id] ?? 0) + 1)}
                  className="rounded-md bg-brand-100 p-1 text-brand-700 hover:bg-brand-200"
                  aria-label={`Increase ${item.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
