// ============================================================================
// File Name: Footer.tsx
// Exact Location: frontend/components/layout/Footer.tsx
// Description: Global footer component with platform branding, navigation, and contact.
// ============================================================================

import Link from "next/link";
import { Send } from "lucide-react";
import { SiteWordmark } from "@/components/layout/BrandingProvider";

export default function Footer() {
  return (
    <footer className="mt-0 border-t border-neutral-200/80 bg-white py-12 text-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 border-b border-neutral-200 pb-10 md:grid-cols-4">

          <div className="md:col-span-1">
            <div className="mb-5 flex items-center gap-3">
              <SiteWordmark />
            </div>
            <p className="mb-5 max-w-xs text-sm leading-6 text-neutral-500">
              Connecting professional talent across Ethiopia with trusted employers and career opportunities.
            </p>
            <a 
              href="https://t.me/EthioSiraJobs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
            >
              <Send size={16} /> Join Telegram Bot
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-950">Platform</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li><Link href="/" className="hover:text-neutral-950 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="hover:text-neutral-950 transition-colors">Hiring Companies</Link></li>
              <li><Link href="/login" className="hover:text-neutral-950 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-neutral-950 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-950">Support</h4>
            <ul className="space-y-2.5 text-sm text-neutral-500">
              <li><Link href="/support" className="hover:text-neutral-950 transition-colors">Help Center</Link></li>
              <li><Link href="/support" className="hover:text-neutral-950 transition-colors">Contact Us</Link></li>
              <li><Link href="/support" className="hover:text-neutral-950 transition-colors">Telegram Alerts Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-950">Headquarters</h4>
            <p className="text-sm leading-6 text-neutral-500">
              Bole Road, Around Edna Mall<br />
              Addis Ababa, Ethiopia<br />
              support@ethiosira.com
            </p>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-neutral-400 md:flex-row">
          <p suppressHydrationWarning>© 2026 EthioSira. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/support" className="hover:text-neutral-950 transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-neutral-950 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
