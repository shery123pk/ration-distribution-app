// ============================================
// Shared TypeScript types for the Ration Distribution App
// ============================================

/** Donation categories accepted by Jaan Group */
export type DonationType = "zakat" | "fitra" | "sadaqah";

/** Status of a distribution record */
export type DistributionStatus = "pending" | "in_progress" | "delivered" | "verified";

/** A single ration item that can be included in a package */
export interface RationItem {
  id: string;
  name: string;
  nameUrdu: string;
  unit: string;        // e.g. "kg", "litre", "bottle"
  pricePerUnit: number; // PKR
  category: string;
}

/** Donor profile */
export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

/** Donation record linked to a donor */
export interface Donation {
  id: string;
  donorId: string;
  type: DonationType;
  amount: number;           // Total PKR amount
  items: SelectedItem[];    // Ration items selected
  message?: string;         // Optional note from donor
  createdAt: string;
}

/** An item selected by the donor with quantity */
export interface SelectedItem {
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  totalPrice: number;
}

/** Beneficiary (receiver of ration) */
export interface Beneficiary {
  id: string;
  name: string;
  cnic: string;           // Pakistani national ID
  phone: string;
  address: string;
  familySize: number;
  verified: boolean;
  addedBy: string;        // Admin who added
  createdAt: string;
}

/** Distribution record — links a donation to a beneficiary with proof */
export interface Distribution {
  id: string;
  donationId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  items: SelectedItem[];
  status: DistributionStatus;
  imageProofUrl?: string;   // Photo of ration handover
  voiceProofUrl?: string;   // Audio dua from beneficiary
  distributedAt?: string;
  verifiedAt?: string;
  notes?: string;
}

/** Chat message for the donor chatbot */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
