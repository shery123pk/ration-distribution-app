import Link from "next/link";
import { Heart, Package, Eye, Shield, Users, BarChart3, Landmark } from "lucide-react";

// ============================================
// Home page — Landing page for Jaan Group Ration Distribution
// ============================================

const FEATURES = [
  {
    icon: Heart,
    title: "Donate with Purpose",
    description:
      "Contribute Zakat, Fitra, or Sadaqah and choose exactly which ration items to provide. Sadaqah donations help all communities regardless of faith.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "See photo and voice proof of every distribution. Know exactly who received your ration.",
  },
  {
    icon: Shield,
    title: "Verified Beneficiaries",
    description:
      "Every family is verified by our team. CNIC-based eligibility ensures fair distribution.",
  },
  {
    icon: Package,
    title: "Custom Ration Packages",
    description:
      "Choose from pre-built packages or select individual items like flour, rice, dal, ghee, and more.",
  },
  {
    icon: Users,
    title: "Serving All Communities",
    description:
      "Zakat and Fitra serve Muslim families worldwide. Sadaqah donations help deserving families of all faiths.",
  },
  {
    icon: BarChart3,
    title: "Data-Backed",
    description:
      "All records synced to Google Sheets for complete transparency and audit trail.",
  },
];

const STATS = [
  { label: "Families Served", value: "500+" },
  { label: "Ration Packages", value: "1,200+" },
  { label: "Donors", value: "300+" },
  { label: "Areas Covered", value: "15+" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Feed a Family,
            <br />
            Earn a Reward
          </h1>
          <p className="mt-4 text-lg text-brand-100">
            Jaan Group distributes ration packages to deserving families
            across Pakistan and beyond. Donate your Zakat, Fitra, or Sadaqah
            and track every delivery with verified proof.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="rounded-lg bg-white px-8 py-4 font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Donate Now
            </Link>
            <Link
              href="/track"
              className="rounded-lg border-2 border-white/30 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Track Distribution
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-6 text-center shadow-lg"
            >
              <p className="text-2xl font-bold text-brand-700">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-2 text-center text-gray-600">
            A transparent, end-to-end ration distribution system
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bank Details Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-gray-900">
            <Landmark className="h-7 w-7 text-brand-600" />
            Send Your Donation
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Transfer your Zakat, Fitra, or Sadaqah directly to our bank account
          </p>
          <div className="mt-8 card bg-gradient-to-br from-brand-50 to-white border-brand-200">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Account Holder</p>
                <p className="mt-1 text-lg font-bold text-gray-900">SHARMEEN ASIF</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Bank</p>
                <p className="mt-1 text-lg font-bold text-gray-900">Meezan Bank</p>
                <p className="text-sm text-gray-600">Hub River Road Branch</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Account Number</p>
                <p className="mt-1 font-mono text-lg font-bold text-brand-700">01610105512619</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">IBAN</p>
                <p className="mt-1 font-mono text-sm font-bold text-brand-700 break-all">PK70MEZN0001610105512619</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                After transfer, share your receipt with us for tracking
              </p>
              <a href="tel:+923302541908" className="btn-primary text-sm">
                Call: +92 330 2541908
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-50 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-800">
            Ready to Make a Difference?
          </h2>
          <p className="mt-4 text-gray-600">
            Every donation feeds a family. Every rupee is tracked. Join hundreds
            of donors who trust Jaan Group.
          </p>
          <Link href="/donate" className="btn-primary mt-8 inline-block">
            Start Donating
          </Link>
        </div>
      </section>
    </div>
  );
}
