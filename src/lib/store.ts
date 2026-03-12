import type { Donor, Donation, Beneficiary, Distribution } from "./types";

// ============================================
// In-memory data store for local development
// Replace with a real database (PostgreSQL, MongoDB, etc.) for production
// Data resets on each server restart
// ============================================

/** Simple in-memory store with typed collections */
class MemoryStore {
  donors: Map<string, Donor> = new Map();
  donations: Map<string, Donation> = new Map();
  beneficiaries: Map<string, Beneficiary> = new Map();
  distributions: Map<string, Distribution> = new Map();

  // --- Donors ---
  getDonor(id: string) {
    return this.donors.get(id) ?? null;
  }
  getDonorByEmail(email: string) {
    return Array.from(this.donors.values()).find((d) => d.email === email) ?? null;
  }
  getAllDonors() {
    return Array.from(this.donors.values());
  }
  saveDonor(donor: Donor) {
    this.donors.set(donor.id, donor);
  }

  // --- Donations ---
  getDonation(id: string) {
    return this.donations.get(id) ?? null;
  }
  getDonationsByDonor(donorId: string) {
    return Array.from(this.donations.values()).filter((d) => d.donorId === donorId);
  }
  getAllDonations() {
    return Array.from(this.donations.values());
  }
  saveDonation(donation: Donation) {
    this.donations.set(donation.id, donation);
  }

  // --- Beneficiaries ---
  getBeneficiary(id: string) {
    return this.beneficiaries.get(id) ?? null;
  }
  getAllBeneficiaries() {
    return Array.from(this.beneficiaries.values());
  }
  saveBeneficiary(beneficiary: Beneficiary) {
    this.beneficiaries.set(beneficiary.id, beneficiary);
  }

  // --- Distributions ---
  getDistribution(id: string) {
    return this.distributions.get(id) ?? null;
  }
  getDistributionsByDonation(donationId: string) {
    return Array.from(this.distributions.values()).filter(
      (d) => d.donationId === donationId
    );
  }
  getAllDistributions() {
    return Array.from(this.distributions.values());
  }
  saveDistribution(distribution: Distribution) {
    this.distributions.set(distribution.id, distribution);
  }
}

// Singleton — persists across API requests during a single server session
const globalStore = globalThis as unknown as { __store?: MemoryStore };
export const store = globalStore.__store ?? (globalStore.__store = new MemoryStore());
