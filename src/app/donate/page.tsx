import DonationForm from "@/components/DonationForm";

// ============================================
// Donation page — Donors select items and submit donations
// ============================================

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Donate Ration
        </h1>
        <p className="mt-2 text-gray-600">
          Choose your donation type, select ration items, and help feed a
          deserving family in Karachi.
        </p>
      </div>

      <DonationForm />
    </div>
  );
}
