import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand-800">
              <Heart className="h-5 w-5 text-brand-600" fill="currentColor" />
              Jaan Group
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              A charitable organization in Karachi dedicated to distributing
              ration packages to deserving families through Zakat, Fitra, and
              Sadaqah donations.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li><a href="/donate" className="hover:text-brand-600">Donate</a></li>
              <li><a href="/track" className="hover:text-brand-600">Track Distribution</a></li>
              <li><a href="/admin" className="hover:text-brand-600">Admin Panel</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900">Contact</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>Karachi, Pakistan</li>
              <li>info@jaangroup.org</li>
              <li>+92-XXX-XXXXXXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Jaan Group. All rights reserved.
          Built with transparency and trust.
        </div>
      </div>
    </footer>
  );
}
