"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Loader2 } from "lucide-react";

// ============================================
// Login page — Simple email-based login for donors
// In production, integrate with NextAuth.js or a proper auth provider
// ============================================

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Replace with real authentication
      // For now, just check if the donor exists in the store
      const res = await fetch("/api/donors");
      const data = await res.json();
      const donor = data.data?.find(
        (d: { email: string }) => d.email.toLowerCase() === email.toLowerCase()
      );

      if (donor) {
        // In production, validate password and set session/JWT
        // For demo, redirect to tracking page
        window.location.href = `/track?email=${encodeURIComponent(email)}`;
      } else {
        setError("No account found with this email. Please register first.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <LogIn className="h-6 w-6 text-brand-600" />
          Donor Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your password"
            />
            <p className="mt-1 text-xs text-gray-400">
              Demo mode: any password works if email exists
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
